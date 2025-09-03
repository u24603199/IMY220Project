import React, { useState } from "react";
import { useParams } from "react-router-dom"
import Sidebar from "../components/SideBar";
import ProjectData from "../components/ProjectData";

export default function Projectview() {
    const { id } = useParams();
    const project = ProjectData.find(p => p.id.toString() === id);

    if (!project) return <div> Project does not exsist </div>

    const {
        image,
        name,
        description,
        downloads,
        favorites,
        commits,
        size,
        createdAt = "2025-01-01",
        author = "JACK",
        files = []
    } = project;

    const [isEditing, setIsEditing] = useState(false);
    const [projectName, setProjectName] = useState(name);

    const toggleEdit = () => setIsEditing(prev => !prev);

    return (
        <>
            <link rel="stylesheet" href="/assets/projectView.css" />
            <Sidebar>
                <div className="project-view-container">
                    <div className="project-header">
                        <img src={image} alt={`${projectName} logo`} className="project-header-image" />
                        <div className="project-meta">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="edit-project-name-input"
                                />
                            ) : (
                                <h1 className="project-title">{projectName}</h1>
                            )}

                            <p><strong>Author:</strong> {author}</p>
                            <p><strong>Created on:</strong> {createdAt}</p>

                            <button onClick={toggleEdit} className="edit-toggle-button">
                                {isEditing ? "Save" : "Edit"}
                            </button>

                            <div className="action-buttons">
                                <button className="download-button">📥 Download</button>
                                <button className="checkout-button">✅ Check Out</button>
                            </div>
                        </div>
                    </div>

                    <div className="project-description">
                        <p>{description}</p>
                    </div>

                    <div className="project-stats">
                        <span>⬇️ {downloads} Downloads</span>
                        <span>⭐ {favorites} Favorites</span>
                        <span>📝 {commits} Commits</span>
                        <span>📦 {size}</span>
                    </div>

                    <div className="project-files">
                        <h2>📁 Files</h2>
                        <ul>
                            {files.map((file, index) => (
                                <li key={index} className="file-item">
                                    <div>
                                        <strong>{file.name}</strong>
                                        <p>{file.message}</p>
                                    </div>
                                    <span className="file-date">🕒 {file.uploadTime}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Sidebar>
        </>
    )
}