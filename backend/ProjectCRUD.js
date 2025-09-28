import connectDB from "./db.js";
const { ObjectId } = require("mongodb");

async function getAllProjects() {
    const db = await connectDB();
    return db.collection("Projects").find().toArray();
}

async function getProjectById(id) {
    const db = await connectDB();
    return db.collection("Projects").findOne({ _id: new ObjectId(id) });
}

async function createProject(projectData) {
    const db = await connectDB();
    const result = await db.collection("Projects").insertOne(projectData);
    return result.ops?.[0] || projectData;
}

async function updateProject(id, updateData) {
    const db = await connectDB();
    return db.collection("Projects").updateOne({ _id: new ObjectId(id) }, { $set: updateData });
}

async function deleteProject(id) {
    const db = await connectDB();
    return db.collection("Projects").deleteOne({ _id: new ObjectId(id) });
}


async function getProjectsByIds(projectIds) {
  const db = await connectDB();
  const objectIds = projectIds.map(id => new ObjectId(id));
  return db.collection("Projects").find({ _id: { $in: objectIds } }).toArray();
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



module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjectsByIds,
    getCheckedOutProjects,
    getProjectsByUserId
};