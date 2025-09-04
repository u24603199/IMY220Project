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
var express = require('express');
var path = require('path');
var cors = require('cors');
var app = express();
app.use(cors());
app.use(express.json());
var publicPath = path.join(__dirname, '..', 'frontend', 'public');
app.use(express["static"](publicPath));
app.get('*', function (req, res) {
  res.sendFile('index.html', {
    root: publicPath
  });
});
app.listen(3000, function () {
  console.log('Server listening on http://localhost:3000');
});