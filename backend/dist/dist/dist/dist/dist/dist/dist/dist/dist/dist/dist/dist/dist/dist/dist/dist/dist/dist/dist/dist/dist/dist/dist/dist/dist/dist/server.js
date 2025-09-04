"use strict";

// import express from "express";
// import cors from "cors";
// import authRoutes from "./auth.js"
// import path from "path";
// // CREATE APP
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// // SERVE A STATIC PAGE IN THE PUBLIC DIRECTORY
// app.use(express.static("./frontend/public"));

// app.use((req, res) => {
//     res.sendFile("index.html", {root: "frontend/public"})
// })

// // PORT TO LISTEN TO
// app.listen(3000, () => {
//     console.log("Listening on localhost:3000");
// });
var express = require("express");
var cors = require("cors");
var path = require("path");
var authRoutes = require("./auth"); // Make sure auth.js uses `module.exports`

var app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Serve static files
var publicPath = path.join(__dirname, "../frontend/public");
app.use(express["static"](publicPath));

// Fallback to index.html for client-side routing (React Router etc.)
app.get("/:wildcard(*)", function (req, res) {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Start server
var PORT = 3000;
app.listen(PORT, function () {
  console.log("Listening on http://localhost:".concat(PORT));
});