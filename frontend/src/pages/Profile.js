import Sidebar from "../components/SideBar";
import React, { useState } from "react";
import ProjectTile from "../components/ProjectTile";
import ProjectData from "../components/ProjectData";
import UserDetails from "../components/UserDetails";
import { useParams } from "react-router-dom";

export default function Profile() {
    const { id } = useParams();

    console.log("Profile id param:", id);

    const [projects, setProjects] = useState(ProjectData);

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing(!isEditing);

    return (
        <>
            <link rel="stylesheet" href="/assets/profile.css" />
            <Sidebar>
                <div className="home-container">
                    <h1>Profile</h1>
                    <div className="profile-header">
                        <div className="profile-info-left">
                            <img
                                src="#"
                                alt="Profile Picture"
                                className="profile-pic"
                            />
                            <div className="profile-stats">
                                <p>Last online: 5 hours ago</p>
                                <p>Commits today: 12</p>
                            </div>
                        </div>
                        <div className="profile-name">
                            <h2>User's Name</h2>
                        </div>
                        <div className="profile-edit" onClick={toggleEdit} style={{ cursor: "pointer" }}>
                            <p> ✏️ </p>
                        </div>
                    </div>


                    <div className="profile-details-container">
                        <UserDetails
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                        />


                        <div className="project-feed">
                            <div className="feed-header">
                                <h2 className="feed-title">Associated Projects </h2>
                                <div className="feed-controls">
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        className="search-input"
                                    />
                                    <button className="filter-button">
                                        <span className="filter-icon">🔍</span>
                                    </button>
                                </div>
                            </div>
                            <div className="project-tiles">
                                {projects.map(project => (
                                    <ProjectTile key={project.id} project={project} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Sidebar>

        </>
    );
}