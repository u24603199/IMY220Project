import express from "express";
import cors from "cors";
import authRoutes from "./auth.js"

// CREATE APP
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
// SERVE A STATIC PAGE IN THE PUBLIC DIRECTORY
app.use(express.static("./frontend/public"));

app.use("*", (req, res) => {
    res.sendFile("index.html", {root: "frontend/public"})
})

// PORT TO LISTEN TO
app.listen(3000, () => {
    console.log("Listening on localhost:3000");
});