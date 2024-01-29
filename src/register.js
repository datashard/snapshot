const lazy = require("lazy-ass");
const is = require("check-more-types");
const snapshot = require("./snapshot");

module.exports = () => {
  lazy(is.fn(global.before), "Missing global before function");
  lazy(is.fn(global.after), "Missing global after function");
  lazy(is.object(global.Cypress), "Missing Cypress object");

  Cypress.Commands.add("snapshot", { prevSubject: "optional" }, snapshot);

  return snapshot;
};
