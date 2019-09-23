const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "fb-ciaorestelli.js",
    libraryTarget: "umd"
  },
  target: "node"
};
