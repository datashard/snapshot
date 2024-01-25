/* eslint-env mocha */
/* global cy */
describe("@datashard/snapshot", () => {
  context("simple types", () => {
    it("works with objects", () => {
      cy.wrap({
        "foo": "bar",
        "Fizzy Drink": "Pop"
      }).snapshot(
        // "Filename", {
        // snapshotPath: "asdasd"
      // }
      );

      // cypress/fixtures/@datashard-snapshot/simple-types/works-with-objects/asdjskadhasj.json
    });

    // it("works with numbers", () => {
    //   cy.wrap(42).snapshot({
    //     snapshotPath: "cypress/fixtures/snapshots",
    //     snapshotName: "Numbers",
    //   });
    // });

    // it("works with strings", () => {
    //   cy.wrap("foo-bar").snapshot({
    //     snapshotPath: "cypress/fixtures/snapshots",
    //     snapshotName: "Strings",
    //   });
    // });

    // it(
    //   "works with arrays",
    //   {
    //     env: {
    //       SNAPSHOT_UPDATE: true,
    //     },
    //   },
    //   () => {
    //     cy.wrap([1, 2, 3, 4]).snapshot({
    //       snapshotPath: "cypress/fixtures/snapshots",
    //       snapshotName: "Arrays",
    //     });
    //   }
    // );
    // it('works with more "complicated" Objects', () => {
    //   cy.fixture("Complex").snapshot({
    //     snapshotPath: 'cypress/fixtures/snapshots',
    //     snapshotName: "Complex"
    //   })
    // })
    // it.only("works based on fixtures", () => {
    //   cy
    //   .wrap({
    //     "jsonapi": {
    //       "version": "2.0"
    //     },
    //     "included": [
    //       {
    //         "type": "users",
    //         "id": "2",
    //         "attributes": {
    //           "name": "Test"
    //         }
    //       }
    //     ]
    //   })
    //   .snapshot({
    //     snapshotFixture: "generated",
    //     // snapshotPath: "cypress/fixtures/snapshots",
    //     // snapshotName: "generated",
    //   });
    // });
  });
});
