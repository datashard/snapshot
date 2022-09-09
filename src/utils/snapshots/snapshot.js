const serializeDomElement = require("../serializers/serializeDomElement");
const serializeToHTML = require("../serializers/serializeToHTML");
const compareValues = require("./compareValues");
const { initStore } = require("snap-shot-store");
// const itsName = require("its-name");
const path = require("path");
const identity = (x) => x;

// Value = the JSON we want to store/compare
// name = the Human Readable name of this Snapshot
// json = decides if we convert DOM elements into JSON when storing in the snapshot file
const pickSerializer = (asJson, value) => {
  if (Cypress.dom.isJquery(value)) {
    return asJson ? serializeDomElement : serializeToHTML;
  }
  return identity;
};

let counters = {};

const newStore = (name) => {
  return initStore(name);
};

const get_snapshot_key = (key) => {
  if (key in counters) {
    // eslint-disable-next-line immutable/no-mutation
    counters[key] += 1;
  } else {
    // eslint-disable-next-line immutable/no-mutation
    counters[key] = 1;
  }
  return counters[key];
};

const store_snapshot = (store, props = { value, name, path, raiser }) => {
  const fileName = props.name
    .join("_")
    .replace(/ /gi, "-")
    .replace(/\//gi, "-");
  const snapshotPath = Cypress.config("snapshot").snapshotPath || "cypress/snapshots"
  const expectedPath = path.join(snapshotPath, `${fileName}.json`);
  // console.log("\x1b[31m%s\x1b[30m", "file: path", expectedPath);
  cy.task("readFileMaybe", expectedPath).then((exist) => {
    // console.log("\x1b[35m%s\x1b[30m", "file: exists", exist); 
    if(exist){
      props.raiser({value: props.value, expected: JSON.parse(exist)})
    } else {
      cy.writeFile(expectedPath, JSON.stringify(props.value))
    }
  });
};

const set_snapshot = (store, { snapshotName, snapshotPath, serialized, value }) => {
  if (!store) return; // no store was initialized

  const message = Cypress._.last(snapshotName);
  console.log("Current Snapshot name", snapshotName);

  const devToolsLog = { $el: serialized };
  // console.log({snapshotName, serialized, value})
  if (Cypress.dom.isJquery(value)) {
    devToolsLog.$el = value;
  }

  const options = {
    name: "snapshot",
    message,
    consoleProps: () => devToolsLog,
  };

  if (value) options.$el = value;

  const raiser = ({ value, expected }) => {
    const result = compareValues({ expected, value });
    result.orElse((json) => {
      devToolsLog.message = json.message;
      devToolsLog.expected = expected;
      delete devToolsLog.value;
      devToolsLog.value = value;

      throw new Error(
        `Snapshot Difference. To update, delete snapshot file and rerun test.\n${json.message}`
      );
    });
  };
  Cypress.log(options);

  store_snapshot(store, {
    value,
    name: snapshotName,
    path: snapshotPath,
    raiser,
  });
};

const get_test_name = (test) => test.titlePath;
const get_snapshot_name = (test, custom_name) => {
  const names = get_test_name(test);
  // const key = names.join(" - ");
  const index = custom_name || get_snapshot_key(key);
  names.push(String(index));
  // console.log("names", names)
  if(custom_name) return [custom_name]
  return names;
};

module.exports = (value, step, { humanName, snapshotPath, json } = {}) => {
  const snapshotName = get_snapshot_name(Cypress.currentTest, humanName || step);
  const serializer = pickSerializer(json, value);
  const serialized = serializer(value);
  const store = newStore(serialized || {});
  set_snapshot(store, {
    snapshotName,
    snapshotPath,
    serialized,
    value,
  });
  // return undefined;
};



