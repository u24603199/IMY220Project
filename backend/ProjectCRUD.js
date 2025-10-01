import connectDB from "./db.js";
const { ObjectId } = require("mongodb");
import fs from "fs";
import path from "path";

async function getAllProjects() {
  const db = await connectDB();
  return db.collection("Projects").find().toArray();
}


async function createProject(projectData) {
  const db = await connectDB();

  const user = await db.collection("Users").findOne({ id: parseInt(projectData.authorId) });
  if (!user) throw new Error("Invalid authorId");


  const lastProject = await db.collection("Projects")
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .toArray();

  const newId = lastProject.length > 0 ? lastProject[0].id + 1 : 1;


  const newProject = {
    id: newId,
    ...projectData,
    author: user.username,
    checkedout: false,
    createdAt: new Date().toISOString(),
    files: [],
  };


  const result = await db.collection("Projects").insertOne(newProject);


  await db.collection("Users").updateOne(
    { id: parseInt(projectData.authorId) },
    { $push: { projects: newId } }
  );

  return result.ops?.[0] || newProject;
}




async function getProjectById(id) {
  const db = await connectDB();
  return db.collection("Projects").findOne({ id: parseInt(id, 10) });
}

const updateProject = async (projectId, updatedData) => {
  const db = await connectDB();

  const result = await db.collection("Projects").updateOne(
    { id: parseInt(projectId, 10) }, 
    { $set: updatedData }             
  );

  if (result.matchedCount === 0) {
    throw new Error("Project not found");
  }

  return await db.collection("Projects").findOne({ id: parseInt(projectId, 10) });
};


async function deleteProject(id) {
  const db = await connectDB();

  const deleteResult = await db.collection("Projects").deleteOne({ id: parseInt(id, 10) });

  await db.collection("Users").updateMany(
    {},
    { $pull: { projects: parseInt(id, 10) } }
  );

  return deleteResult;
}

async function getProjectsByIds(projectIds) {
  const db = await connectDB();
  const numericIds = projectIds.map(id => parseInt(id, 10));
  return db.collection("Projects").find({ id: { $in: numericIds } }).toArray();
}

async function getCheckedOutProjects() {
  const db = await connectDB();
  return db.collection("Projects").find({ checkedout: true }).toArray();
}

async function getProjectsByUserId(userId) {
  const db = await connectDB();

  const user = await db.collection("Users").findOne({ id: userId });
  if (!user) return null;

  const projects = await db.collection("Projects").find({
    id: { $in: user.projects || [] }
  }).toArray();

  return projects;
}

async function getLocalProjects(userId) {
  const db = await connectDB();

  const user = await db.collection("Users").findOne({ id: userId });
  if (!user) return null;

  const friendIds = user.friends || [];

  const friends = await db.collection("Users")
    .find({ id: { $in: friendIds } })
    .toArray();

  const allProjectIds = [
    ...(user.projects || []),
    ...friends.flatMap(friend => friend.projects || [])
  ];


  const uniqueProjectIds = [...new Set(allProjectIds)];

  const projects = await db.collection("Projects")
    .find({ id: { $in: uniqueProjectIds } })
    .toArray();

  return projects;
}


async function getCheckedOutProjectsByUserId(userId) {
  const db = await connectDB();
  const user = await db.collection("Users").findOne({ id: parseInt(userId) });
  if (!user || !user.projects) return [];

  return db.collection("Projects").find({
    id: { $in: user.projects },
    checkedout: true
  }).toArray();
}


async function getNotCheckedOutProjectsByUserId(userId) {
  const db = await connectDB();
  const user = await db.collection("Users").findOne({ id: parseInt(userId) });
  if (!user || !user.projects) return [];

  return db.collection("Projects").find({
    id: { $in: user.projects },
    checkedout: false
  }).toArray();
}

async function checkoutProject(projectId) {
  const db = await connectDB();
  return await db.collection("Projects").updateOne({ id: projectId, checkedout: false }, { $set: { checkedout: true } });
}

async function checkinProject(projectId) {
  const db = await connectDB();
  return await db.collection("Projects").updateOne({ id: projectId, checkedout: true }, { $set: { checkedout: false } });
}

async function updateProjectWithImage(req, res) {
  try {
    const boundaryHeader = req.headers["content-type"];
    if (!boundaryHeader) {
      return res.status(400).send("Missing Content-Type header");
    }

    const boundary = boundaryHeader.split("boundary=")[1];
    if (!boundary) {
      return res.status(400).send("Missing boundary in Content-Type");
    }

    let rawData = Buffer.alloc(0);

    await new Promise((resolve, reject) => {
      req.on("data", (chunk) => {
        rawData = Buffer.concat([rawData, chunk]);
      });

      req.on("end", () => resolve());
      req.on("error", (err) => reject(err));
    });

    const parts = rawData.toString().split(`--${boundary}`);

    const namePart = parts.find(part => part.includes('name="name"'));
    if (!namePart) {
      return res.status(400).send("Missing project name");
    }
    const nameMatch = namePart.match(/\r\n\r\n([\s\S]*?)\r\n$/);
    const projectName = nameMatch ? nameMatch[1].trim() : null;
    if (!projectName) {
      return res.status(400).send("Invalid project name");
    }

    const imagePart = parts.find(part =>
      part.includes('name="image"') && part.includes("filename=")
    );

    let imageUrl;

    if (imagePart) {
      const fileNameMatch = imagePart.match(/filename="(.+?)"/);
      if (!fileNameMatch) {
        return res.status(400).send("Invalid file upload");
      }
      const filename = fileNameMatch[1];

      const contentTypeMatch = imagePart.match(/Content-Type: (.+)/);
      if (!contentTypeMatch) {
        return res.status(400).send("Invalid file upload");
      }

      const fileDataStart = imagePart.indexOf("\r\n\r\n") + 4;
      const fileDataEnd = imagePart.lastIndexOf("\r\n");
      const fileData = imagePart.slice(fileDataStart, fileDataEnd);

      const buffer = Buffer.from(fileData, "binary");

      // Use env var or relative path to frontend public assets
      const saveDir = process.env.PROJECT_IMAGE_PATH ||
        path.resolve(__dirname, "../../frontend/public/assets/images/Projects");

      if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
      }

      const uniqueName = `image-${Date.now()}-${Math.floor(Math.random() * 10000)}${path.extname(filename)}`;
      const filePath = path.join(saveDir, uniqueName);
      imageUrl = `/assets/images/Projects/${uniqueName}`;

      console.log("Saving file to:", filePath);

      try {
        fs.writeFileSync(filePath, buffer);
        console.log("File saved successfully");
      } catch (err) {
        console.error("Error saving file:", err);
        return res.status(500).send("Failed to save file");
      }
    }

    const updateData = { name: projectName };
    if (imageUrl) updateData.image = imageUrl;

    const result = await updateProject(req.params.id, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).send("Project not found");
    }

    const updatedProject = await getProjectById(req.params.id);
    return res.json(updatedProject);

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
}




module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByIds,
  getCheckedOutProjects,
  getProjectsByUserId,
  getLocalProjects,
  getCheckedOutProjectsByUserId,
  getNotCheckedOutProjectsByUserId,
  checkinProject,
  checkoutProject,
  updateProjectWithImage,
};