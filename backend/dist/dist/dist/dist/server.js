"use strict";

var _express = _interopRequireDefault(require("express"));
var _cors = _interopRequireDefault(require("cors"));
var _auth = _interopRequireDefault(require("./auth.js"));
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
app.use("*", function (req, res) {
  res.sendFile("index.html", {
    root: "frontend/public"
  });
});

// PORT TO LISTEN TO
app.listen(3000, function () {
  console.log("Listening on localhost:3000");
});