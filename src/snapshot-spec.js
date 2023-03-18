const api = require(".");
const la = require("lazy-ass");
const is = require("check-more-types");

describe("@datashard/snapshot", () => {
  it("is an object", () => {
    la(is.object(api));
  });

  it("has register", () => {
    la(is.fn(api.register));
  });
});
