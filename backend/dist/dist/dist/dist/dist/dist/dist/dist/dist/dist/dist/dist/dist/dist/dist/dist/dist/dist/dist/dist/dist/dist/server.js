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

// Serve static files from frontend/public
app.use(express["static"](path.join(__dirname, '..', 'frontend', 'public')));

// Catch-all to serve index.html for any other route (for SPA routing)
app.get('*', function (req, res) {
  res.sendFile('index.html', {
    root: path.join(__dirname, '..', 'frontend', 'public')
  });
});

// Listen on port 3000
app.listen(3000, function () {
  console.log('Listening on localhost:3000');
});