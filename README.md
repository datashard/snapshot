# @datashard/snapshot

> Adds support for Value, Object, and Dom Element Snapshot Testing to Cypress

## Breaking Changes
> [!WARNING]
The `readFileMaybe` task was required in previous Versions, this has been changed so this Module now uses the `cy.fixture` Command to get the contents of existing files. This means that this module will only be able to write new tests if `updateSnapshots` (previously `SNAPSHOT_UPDATE`) is set to true through Environment Variables or through the Cypress config.
\
This also means, that previous tests will likely be broken, *please make sure that your tests pass before updating to the latest version of this module*  

## Install
Requires Node 16 or above

```sh
npm i --save-dev @datashard/snapshot
```

## Import
After Installing, you'll need to add the following import into your Commands/Support File
> by default this will be `cypress/support/e2e.js`

```js
require('@datashard/snapshot').regsiter()
```

This will register a new Command `.snapshot()`, to create new Snapshots and once created, to compare their Values.

## Config
You can pass `updateSnapshots` and `useFolders` as options in the `cypress.config.js` file

<!-- ![Example Settings for the Module](./.github/assets/config.png) -->

Alternatively, you can also add `snapshotUpdate` as an Environment Variable to update your snapshots.

Simply pass `--env updateSnapshots=true` when running Cypress.

> If you don't use the default fixture folder, you will also need to add `snapshotPath` to this module's config with the same path you use for `fixtureFolder`.

## Usage

If properly added, usage of this plugin is rather simple, simply add `.snapshot()` to cypress functions that return valid JSON.

### Example
```js
describe("my tests", () => {
  it("works", () => {
    cy.log("first snapshot");
    cy.wrap({ foo: 42 }).snapshot("foo");
    cy.log("second snapshot");
    cy.wrap({ bar: 101 }).snapshot("bar");
  });
});
```

Depending on your settings, this module will then save your snapshots as
```ts
// useFolders: false
cypress/fixtures/snapshots/my-tests__works__foo.json
cypress/fixtures/snapshots/my-tests__works__bar.json

// useFolders: true
cypress/fixtures/snapshots/my-tests/works/foo.json
cypress/fixtures/snapshots/my-tests/works/bar.json

```

Snapshots will generally be saved using this convention, provided by Cypress:

```
{fixtureFolder}/<Context>-<Describe>-<It>-<Name?>.json
{fixtureFolder}/<Context>/<Describe>/<It>/<Name?>.json
```

If a step wasn't named, it will instead use the `<It>`for the file name, though this means that you will not be able to have more than 1 Snapshot in your It Block, as it would overwrite the previously created Snapshot files.


Of course, if a value changed, it will no longer match the snapshot and throw an Error.
![](./.github/assets/Error.png)