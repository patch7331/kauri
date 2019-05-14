/** @format */

const path = require("path");

module.exports = {
  target: "electron-renderer",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
          plugins: [["@babel/plugin-transform-react-jsx", { pragma: "h" }]],
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [
      path.resolve(__dirname, "src/renderer"),
      path.resolve(__dirname, "node_modules"),
    ],
  },
};
