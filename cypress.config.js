const { defineConfig } = require("cypress");

module.exports = defineConfig({
  snapshot: {
    // snapshotPath: "cypress/snapshots/",
    // SNAPSHOT_UPDATE: true,
    useFolders: true,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
