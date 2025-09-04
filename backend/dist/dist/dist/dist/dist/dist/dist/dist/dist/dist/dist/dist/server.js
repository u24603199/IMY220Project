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
// CREATE APP
var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use("/api/auth", _auth["default"]);
// SERVE A STATIC PAGE IN THE PUBLIC DIRECTORY
app.use(_express["default"]["static"]("./frontend/public"));
app.use(function (req, res) {
  res.sendFile("index.html", {
    root: "frontend/public"
  });
});

// PORT TO LISTEN TO
app.listen(3000, function () {
  console.log("Listening on localhost:3000");
});

// const express = require('express');
// const path = require('path');
// const cors = require('cors');

// const app = express();

// app.use(cors());
// app.use(express.json());

// const publicPath = path.join(__dirname, '..', 'frontend', 'public');

// app.use(express.static(publicPath));

// app.get('*', (req, res) => {
//     res.sendFile('index.html', { root: publicPath });
// });

// app.listen(3000, () => {
//     console.log('Server listening on http://localhost:3000');
// });