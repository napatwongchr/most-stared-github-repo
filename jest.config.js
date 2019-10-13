const path = require("path");

module.exports = {
  setupFilesAfterEnv: [path.resolve(__dirname, "./setupTests.js")]
};
