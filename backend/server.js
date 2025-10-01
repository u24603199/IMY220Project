import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./auth.js";
import projectRoutes from "./ProjectCRUDRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Serve static frontend files
app.use(express.static("./frontend/public"));

// Catch-all for frontend routes
app.use("*", (req, res) => {
  res.sendFile("index.html", { root: "frontend/public" });
});

// Start server
app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});