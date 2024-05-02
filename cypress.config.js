const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // fixturesFolder: "cypress/fixtures",
  snapshot: {
    // updateSnapshots: true,
    useFolders: true,
    // useSnapshotFolder: true
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});