require("@babel/register")({
  presets: ["@babel/preset-env"],
  plugins: [
    [
      "@babel/plugin-proposal-class-properties",
      {
        loose: true,
      },
    ],
  ],
  ignore: ["node_modules"],
});

// Import the rest of our application.
module.exports = require("./server.js");
