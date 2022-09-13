/* eslint-env mocha */
/* global cy */
describe("@cypress/snapshot", () => {
  context("simple types", () => {
    it("works with objects", () => {
      cy.fixture("File2").snapshot({
        snapshotPath: "cypress/snapshots",
        snapshotName: "Objects",
      });
    });

    it("works with numbers", () => {
      cy.wrap(42).snapshot({
        snapshotPath: "cypress/snapshots",
        snapshotName: "Numbers",
      });
    });

    it("works with strings", () => {
      cy.wrap("foo-bar").snapshot({
        snapshotPath: "cypress/snapshots",
        snapshotName: "Strings",
      });
    });

    it("works with arrays", () => {
      cy.wrap([1, 2, 3]).snapshot({
        snapshotPath: "cypress/snapshots",
        snapshotName: "Arrays",
      });
    });
  });
});
