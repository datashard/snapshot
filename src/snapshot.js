const serializeDomElement = require("./utils/serializers/serializeDomElement");
const serializeToHTML = require("./utils/serializers/serializeToHTML");
const compareValues = require("./utils/compareValues");
const path = require("path");
const identity = (x) => x;

const pickSerializer = (asJson, value) => {
  if (Cypress.dom.isJquery(value)) {
    return asJson ? serializeDomElement : serializeToHTML;
  }
  return identity;
};

const store_snapshot = (props = { value, name, raiser }) => {
  if (Cypress.env().updateSnapshots || Cypress.config('snapshot').updateSnapshots) {
    cy.log(props.name)
    console.log(props.name)
    cy.writeFile(`${props.name}.json`, JSON.stringify(props.value, null, 2))
  } else {
    // TODO: Figure out how to replace the fixture folder name if people move it 
    const fixtureName = props.name.replace("cypress/fixtures", "")
    cy.fixture(fixtureName).then(content => props.raiser({ value: props.value, expected: content }))
  }
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
    if ((!Cypress.env().updateSnapshots || !Cypress.config('snapshot').updateSnapshots) && !result.success) {
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

function replaceCharacters(str, asFolder, sep) {
  if (asFolder) {
    if (!sep) throw new Error("Separator not Passed.")
    return str
      .replace(/ /gi, '-')
      .replace(/\//gi, "-")
      .replaceAll('"', '')
      .replaceAll(sep, '/')
  } else {
    return str
      .replaceAll(' ', '-')
      .replaceAll('/', '-')
      .replaceAll('"', '')
  }
}

const get_snapshot_name = (asFolder, stepName) => {
  const names = Cypress.currentTest.titlePath;
  const sep = ">>datashard.work<<"


  if (stepName && typeof stepName !== 'object') {
    names.push(stepName)
  }


  if (asFolder) return replaceCharacters(names.join(sep), true, sep)
  else return replaceCharacters(names.join('__'), false)
};

module.exports = (value, stepName, options = { json: true }) => {
  if (typeof stepName === 'object') options = { ...options, ...stepName }
  if (typeof value !== "object" || Array.isArray(value))
    value = { data: value };
  const serializer = pickSerializer(options.json, value);
  const serialized = serializer(value);
  options.asFolder = Cypress.config('snapshot').useFolders || false

  set_snapshot({
    snapshotName: path.join(
      options.snapshotPath || Cypress.config('snapshot').snapshotPath || 'cypress/fixtures/snapshots',
      `/${get_snapshot_name(options.asFolder, stepName)}`),
    serialized,
    value,
  });
};
