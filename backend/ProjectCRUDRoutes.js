import express from "express";
const router = express.Router();
import projectModel from "./ProjectCRUD.js";

//All projects
router.get("/", async (req, res) => {
    const projects = await projectModel.getAllProjects();
    res.json(projects);
});

//Project by Id
router.get("/:id", async (req, res) => {
    try {
        const project = await projectModel.getProjectById(req.params.id);
        if (!project) return res.status(404).send("Project not found");
        res.json(project);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

//New Project
router.post("/", async (req, res) => {
    try {
        const result = await projectModel.createProject(req.body);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

//Update project
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        const result = await projectModel.updateProject(id, updateData);

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

//Get Project by User id
router.get("/user/:userId/projects", async (req, res) => {
    const userId = req.params.userId;
    try {
        const projects = await projectModel.getProjectsByUserId(req.params.userId);

        if (!projects) {
            return res.status(404).send("User not found");
        }

        res.json(projects);
    } catch (error) {
        console.error("Error in /user/:userId/projects:", error);
        res.status(500).send("Server error");
    }
});


//Delete a project
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const result = await projectModel.deleteProject(id);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

//Get checked out stuff
router.get("/checkedout", async (req, res) => {
    try {
        const checkedOutProjects = await projectModel.getCheckedOutProjects();
        res.json(checkedOutProjects);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

module.exports = router;
