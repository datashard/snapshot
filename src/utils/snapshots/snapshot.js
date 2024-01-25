const serializeDomElement = require("../serializers/serializeDomElement");
const serializeToHTML = require("../serializers/serializeToHTML");
const compareValues = require("./compareValues");
const path = require("path");
const identity = (x) => x;

const pickSerializer = (asJson, value) => {
  if (Cypress.dom.isJquery(value)) {
    return asJson ? serializeDomElement : serializeToHTML;
  }
  return identity;
};

const store_snapshot = (props = { value, name, raiser }) => {
  if (!Cypress.env().SNAPSHOT_UPDATE) {
    cy.fixture(props.name).then(content => props.raiser({ value: props.value, expected: content }))
  } else {
    cy.writeFile(`${props.name}.json`, JSON.stringify(props.value.null, 2))
  }


  // cy.fixture(props.name)
  //   .then(exist => {
  //     cy.log('fixture 2')
  //     if (exist && !Cypress.env().SNAPSHOT_UPDATE) {
  //       cy.log(`fixture exists and doesn't update`)
  //       props.raiser({ value: props.value, expected: exist, type: "fixture" });
  //     } else {
  //       cy.log(`fixture exists and updates`)
  //       cy.writeFile(expectedPath, JSON.stringify(props.value, null, 2));
  //     }
  //   })
};

const set_snapshot = ({ snapshotName, serialized, value }) => {
  let devToolsLog = { $el: serialized };
  if (Cypress.dom.isJquery(value)) {
    devToolsLog.$el = value;
  }

  const options = {
    name: "snapshot",
    message: snapshotName,
    consoleProps: () => devToolsLog,
  };

  if (value) options.$el = value;

  const raiser = ({ value, expected }) => {
    const result = compareValues({ expected, value });
    if (!Cypress.env().SNAPSHOT_UPDATE && !result.success) {
      devToolsLog = {
        ...devToolsLog,
        message: result,
        expected,
        value,
      };

      throw new Error(
        `Snapshot Difference found.\nPlease Update the Snapshot\n
        

        ${JSON.stringify(result.result.replaceAll(/[╺┿╳]/g, ""), null, 2)}`
      );
    }
  };
  Cypress.log(options);

  store_snapshot({
    value,
    name: snapshotName,
    raiser,
  });
};

const get_snapshot_name = (asFolder, stepName) => {
  const names = Cypress.currentTest.titlePath;
  const sep = ">>datashard.work<<"
  if (stepName) names.push(stepName)

  if (asFolder) return names.join(sep).replace(/ /gi, "-").replace(/\//gi, "-").replaceAll(sep, '/')
  else return names.join('__').replaceAll(" ", "-").replaceAll("/", "-")
};

module.exports = (value, stepName, options = { json: true, asFolder: false }) => {
  if (typeof value !== "object" || Array.isArray(value))
    value = { data: value };
  const serializer = pickSerializer(options.json, value);
  const serialized = serializer(value);
  set_snapshot({
    snapshotName: path.join(
      options.snapshotPath || Cypress.config('snapshot').snapshotPath || 'snapshots',
      `/${get_snapshot_name(options.asFolder, stepName)}`),
    serialized,
    value,
  });
};
