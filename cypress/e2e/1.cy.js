/* eslint-env mocha */
/* global cy */
describe("datashard/snapshot", () => {
  context("simple types"
    // , { env: { updateSnapshots: true } }
    , () => {
      it("works with objects", () => {
        cy.wrap({
          "foo": "bar",
          "Fizzy Drink": "Pop"
        }).snapshot();
      });

      it("works with numbers", () => {
        cy.wrap(42).snapshot({
          snapshotPath: "cypress/fixtures/snapshots",
          snapshotName: "Numbers",
        });
      });

      it("works with strings", () => {
        cy.wrap("foo-bar").snapshot({
          snapshotPath: "cypress/fixtures/snapshots",
          snapshotName: "Strings",
        });
      });

      it(
        "works with arrays",
        {
          env: {
            updateSnapshots: true,
          },
        },
        () => {
          cy.wrap([1, 2, 3, 4]).snapshot({
            snapshotPath: "cypress/fixtures/snapshots",
            snapshotName: "Arrays",
          });
        }
      );

    });
  context("complex types"
    // , { env: { SNAPSHOT_UPDATE: true } }
    , () => {
      it('works with more "complicated" Objects', () => {
        cy.wrap({
          "status": 200,
          "response": {
            "array": [0, 1, 2, "4"],
            "object": {
              "with": "more details"
            }
          },
          "thisisnew": "wtf"
        }).snapshot()
      })
      it("works based on fixtures", () => {
        cy
          .wrap({
            "jsonapi": {
              "version": "2.0"
            },
            "included": [
              {
                "type": "users",
                "id": "2",
                "attributes": {
                  "name": "Test"
                }
              }
            ]
          })
          .snapshot();
      });
    })
});
