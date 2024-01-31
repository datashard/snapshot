/* eslint-env mocha */
/* global cy */
describe("Random Describe", () => {
  context("Random Context", () => {
    it("Random It", () => {
      cy.wrap(42).snapshot("Numbers");
      cy.wrap("foo-bar").snapshot("Strings");
      cy.wrap([1, 2, 3]).snapshot("Arrays");
    });

    // it("works with numbers", () => {
    // console.log(cy.wrap(42))
    // });

    // it("works with strings", () => {
    // console.log(cy.wrap("foo-bar"))
    // });

    // it("works with arrays", () => {
    // console.log(cy.wrap([1, 2, 3]))
    // });
  });
});
