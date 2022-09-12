/* eslint-env mocha */
/* global cy */
describe("@cypress/snapshot", () => {
  context("simple types", () => {
    it("works with objects", () => {
      cy.fixture("File2").snapshot(
        "Compare Files"
        ,{
          snapshotPath: "cypress/snapshots",
          snapshotName: "Comparison"
        }
      );
    });

    // it("works with numbers", () => {
    // console.log(cy.wrap(42))
    // cy.wrap(42).snapshot();
    // });

    // it("works with strings", () => {
    // console.log(cy.wrap("foo-bar"))
    // cy.wrap("foo-bar").snapshot();
    // });

    // it("works with arrays", () => {
    // console.log(cy.wrap([1, 2, 3]))
    // cy.wrap([1, 2, 3]).snapshot();
    // });
  });
});
