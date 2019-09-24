const path = require("path");

module.exports = [
  {
    entry: "./src/lambdas/auth/index.js",
    mode: "production",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "auth.js",
      libraryTarget: "umd"
    },
    target: "node",
    externals: ["aws-sdk"]
  },
  {
    entry: "./src/lambdas/post/index.js",
    mode: "production",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "post.js",
      libraryTarget: "umd"
    },
    target: "node",
    externals: ["aws-sdk"]
  }
];
