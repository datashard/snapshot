const { defineConfig } = require("cypress");

module.exports = defineConfig({
  
  snapshot: {
    updateSnapshots: true,
    useFolders: true,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
