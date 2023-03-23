const serializeDomElement = require("../serializers/serializeDomElement");
const serializeToHTML = require("../serializers/serializeToHTML");
const compareValues = require("./compareValues");
const { initStore } = require("snap-shot-store");
const path = require("path");
const identity = (x) => x;

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
  const snapshotPath =
    props.path ||
    Cypress.config("snapshot").snapshotPath ||
    "cypress/snapshots";

  const expectedPath = path.join(snapshotPath, `${fileName}.json`);
  cy.task("readFileMaybe", expectedPath).then((exist) => {
    if (exist && !Cypress.env().SNAPSHOT_UPDATE) {
      props.raiser({ value: props.value, expected: JSON.parse(exist) });
    } else {
      cy.writeFile(expectedPath, JSON.stringify(props.value));
    }
  });
};

const set_snapshot = (
  store,
  { snapshotName, snapshotPath, serialized, value }
) => {
  if (!store) return;

  const message = Cypress._.last(snapshotName);

  const devToolsLog = { $el: serialized };

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
    if (!Cypress.env().SNAPSHOT_UPDATE && result.value) {
      result.orElse((json) => {
        devToolsLog.message = json.message;
        devToolsLog.expected = expected;
        delete devToolsLog.value;
        devToolsLog.value = value;

        throw new Error(
          `Snapshot Difference.\nPlease Update the Snapshot\n\n\t${json.message}`
        );
      });
    }
  };
  Cypress.log(options);

  store_snapshot(store, {
    value,
    name: snapshotName,
    path: snapshotPath,
    raiser,
  });
};

const get_snapshot_name = (test, custom_name) => {
  const names = test.titlePath;

  const index = custom_name;
  names.push(String(index));

  if (custom_name) return [custom_name];
  return names;
};

module.exports = (value, step, options) => {
  if (typeof step === "object") options = step;
  if (typeof value !== "object" || Array.isArray(value))
    value = { data: value };

  const name = get_snapshot_name(
    Cypress.currentTest,
    options.snapshotName || step
  );
  const serializer = pickSerializer(options.json, value);
  const serialized = serializer(value);
  const store = newStore(serialized || {});

  set_snapshot(store, {
    snapshotName: name,
    snapshotPath: options.snapshotPath,
    serialized,
    value,
  });
};
