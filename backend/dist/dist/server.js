"use strict";

var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _auth = _interopRequireDefault(require("./auth.js"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : {
    "default": e
  };
}
// import express from "express";
// import cors from "cors";
// import authRoutes from "./auth.js"

// // CREATE APP
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// // SERVE A STATIC PAGE IN THE PUBLIC DIRECTORY
// app.use(express.static("./frontend/public"));

// app.use("*", (req, res) => {
//     res.sendFile("index.html", {root: "frontend/public"})
// })

// // PORT TO LISTEN TO
// app.listen(3000, () => {
//     console.log("Listening on localhost:3000");
// });

var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use("/api/auth", _auth["default"]);

// Absolute path to frontend public folder
var publicPath = _path["default"].resolve("frontend/public");

// Serve static files from frontend/public
app.use(_express["default"]["static"](publicPath));

// Fallback route: serve index.html for any unmatched route (SPA support)
app.use("*", function (req, res) {
  res.sendFile("index.html", {
    root: publicPath
  });
});

// Start server
app.listen(3000, function () {
  console.log("Listening on localhost:3000");
});