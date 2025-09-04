"use strict";

var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = _express["default"].Router();
var dummyUser = {
  id: 1,
  email: "test@example.com",
  name: "John Doe",
  token: "dummy-token"
};
router.post("/signup", function (req, res) {
  var _req$body = req.body,
    email = _req$body.email,
    password = _req$body.password;
  res.status(201).json({
    message: "User signed up successfully",
    user: dummyUser
  });
});
router.post("/signin", function (req, res) {
  var _req$body2 = req.body,
    email = _req$body2.email,
    password = _req$body2.password;
  if (email && password) {
    res.json({
      message: "User signed in successfully",
      user: dummyUser
    });
  } else {
    res.status(400).json({
      message: "Missing email or password"
    });
  }
});
module.exports = router;