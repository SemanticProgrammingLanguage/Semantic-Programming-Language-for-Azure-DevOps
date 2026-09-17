const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    "CodeEditorContribution/CodeEditorContribution": "./src/CodeEditorContribution.ts",
    "SemanticRenderer/index": "./src/renderer/index.ts"
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  resolve: { extensions: [".ts", ".js", ".json"] },
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }]
  },
  plugins: [
    new CopyWebpackPlugin({ patterns: [
      { from: "src/CodeEditorContribution.html", to: "CodeEditorContribution/CodeEditorContribution.html" },
      { from: "src/renderer/index.html", to: "SemanticRenderer/index.html" }
    ] })
  ]
};
