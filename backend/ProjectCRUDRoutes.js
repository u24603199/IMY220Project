import express from "express";
const router = express.Router();
import * as projectModel from "./ProjectCRUD.js";
const multer = require("multer");
const path = require("path");
const archiver = require("archiver");
const fs = require('fs');


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

// New Project
router.post("/newProject", async (req, res) => {
    try {
        const { authorId, ...projectData } = req.body;

        if (!authorId) {
            return res.status(400).json({ message: "authorId is required" });
        }

        const newProject = await projectModel.createProject({
            ...projectData,
            authorId: parseInt(authorId),
        });

        res.status(201).json(newProject);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Server error" });
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
    const userId = parseInt(req.params.userId);
    try {
        const projects = await projectModel.getProjectsByUserId(userId);

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
        const id = parseInt(req.params.id);
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
router.get("/checkout", async (req, res) => {
    try {
        const checkedOutProjects = await projectModel.getCheckedOutProjects();
        res.json(checkedOutProjects || []);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Get local projects (user + friends)
router.get("/local/:userId", async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const projects = await projectModel.getLocalProjects(userId);

        if (!projects) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(projects);
    } catch (error) {
        console.error("Error in /local/:userId:", error);
        res.status(500).send("Server error");
    }
});

router.get("/checkout/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const projects = await projectModel.getCheckedOutProjectsByUserId(userId);
        res.json(projects);
    } catch (error) {
        console.error("Error in /checkout/:id:", error);
        res.status(500).send("Server error");
    }
});


router.get("/notcheckout/:id", async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const projects = await projectModel.getNotCheckedOutProjectsByUserId(userId);
        res.json(projects);
    } catch (error) {
        console.error("Error in /notcheckout/:id:", error);
        res.status(500).send("Server error");
    }
});

router.post("/:id/checkout", async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);

        const result = await projectModel.checkoutProject(projectId);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Project not found or already checked out" });
        }

        res.json({ message: "Project checked out successfully" });
    } catch (error) {
        console.error("Error in checkout:", error);
        res.status(500).send("Server error");
    }
});

router.post("/:id/checkin", async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);

        const result = await projectModel.checkinProject(projectId);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Project not found or already checked in" });
        }

        res.json({ message: "Project checked in successfully" });
    } catch (error) {
        console.error("Error in checkin:", error);
        res.status(500).send("Server error");
    }
})

// Update project (no image)
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

//NEED TO SPLIT NEED TO SPLIT
//NEED TO SPLIT NEED TO SPLIT
//NEED TO SPLIT NEED TO SPLIT

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const saveDir = process.env.PROJECT_IMAGE_PATH ||
            path.resolve(__dirname, "../../frontend/public/assets/images/Projects");
        cb(null, saveDir);
    },
    filename: (req, file, cb) => {
        cb(null, `image-${Date.now()}-${Math.floor(Math.random() * 10000)}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/:id/updateWithImage", (req, res, next) => {
    upload.single("image")(req, res, function (err) {
        if (err) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ message: "File too large. Max size is 5MB." });
            }
            return res.status(500).json({ message: "File upload error." });
        }
        next();
    });
}, async (req, res) => {
    // console.log("Received file:", req.file);  
    // console.log("Received body:", req.body);  
    try {
        const projectId = req.params.id;
        const { name } = req.body;
        const image = req.file ? `/assets/images/Projects/${req.file.filename}` : null;


        const updateData = { name };
        if (image) {
            updateData.image = image;
        }

        const updatedProject = await projectModel.updateProject(projectId, updateData);

        if (!updatedProject) {
            return res.status(404).send("Project not found");
        }

        res.json(updatedProject);
    } catch (err) {
        console.error("Error updating project:", err);
        res.status(500).send("Server error");
    }
});


router.post('/:id/uploadFiles', upload.fields([{ name: "files" }]), async (req, res) => {
    // console.log("Files received:", req.files);
    // console.log("Body received:", req.body);

    const { id } = req.params;
    const project = await projectModel.getProjectById(id);
    if (!project) return res.status(404).send('Project not found.');
    if (!project.checkedout) return res.status(400).send('Project must be checked out to upload files.');

    const files = req.files.files;
    //console.log(files);
    if (!files || files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    files.forEach(file => {
        project.files.push({
            storedName: file.filename,
            name: file.originalname,
            size: file.size,
            uploadTime: new Date().toISOString(),
            message: req.body.commitMessage,
        });
    });

    await projectModel.updateProject(project.id, { files: project.files });
    res.json(project);
});

router.post('/:id/updateSize', async (req, res) => {
    const { id } = req.params;
    const { newSize, commitMessage } = req.body;

    const project = await projectModel.getProjectById(id);
    if (!project) return res.status(404).send('Project not found.');

    project.size = newSize;
    project.message = commitMessage;
    project.commits += 1;

    await projectModel.updateProject(project.id, {
        size: project.size,
        message: project.message,
        commits: project.commits,
    });
    res.json(project);
});


router.get('/:id/download', async (req, res) => {
    const { id } = req.params;

    try {
        const project = await projectModel.getProjectById(id);
        if (!project) return res.status(404).send("Project not found.");

        await projectModel.updateProject(id, { downloads: (project.downloads || 0) + 1 });

        const files = project.files || [];

        if (!files.length) {
            return res.status(404).send("No files to download.");
        }

        res.setHeader('Content-Disposition', `attachment; filename=project_${id}.zip`);
        res.setHeader('Content-Type', 'application/zip');

        const archive = archiver('zip', {
            zlib: { level: 9 },
        });

        archive.on('error', (err) => {
            console.error('Archiving error:', err);
            res.status(500).send('Error creating zip archive.');
        });

        archive.pipe(res);

        files.forEach((file) => {
            const filesDir = path.resolve(__dirname, '../../frontend/public/assets/images/Projects');
            const fullPath = path.resolve(filesDir, file.storedName);
            //console.log('Looking for file at:', fullPath);
            if (fs.existsSync(fullPath)) {
                archive.file(fullPath, { name: file.name });
            } else {
                console.warn(`Missing file on disk: ${fullPath}`);
            }
        });

        await archive.finalize();
    } catch (err) {
        console.error('Download error:', err);
        res.status(500).send('Error downloading files.');
    }
});

//NEED TO SPLIT NEED TO SPLIT
//NEED TO SPLIT NEED TO SPLIT
//NEED TO SPLIT NEED TO SPLIT

module.exports = router;
