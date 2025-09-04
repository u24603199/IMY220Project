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
var authRoutes = require("./auth");

// CREATE APP
var app = express();

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);

// Serve static files from frontend/public
var publicPath = path.join(__dirname, "../frontend/public");
app.use(express["static"](publicPath));

// Fallback route for React Router (SPA)
app.get("/*", function (req, res) {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Start the server
app.listen(3000, function () {
  console.log("Listening on http://localhost:3000");
});