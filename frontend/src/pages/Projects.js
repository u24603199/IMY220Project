import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import ProjectData from "../components/ProjectData";
import ProjectFeeds from "../components/ProjectFeeds";
import AddProject from "../components/AddProject";

export default function Project() {
    const [showForm, setForm] = useState(false);

    const normalProjects = ProjectData.filter(project => !project.checkedout);
    const checkedoutProjects = ProjectData.filter(project => project.checkedout);

    const toggleForm = () => setForm(prev => !prev);

    return (
        <>
            <link rel="stylesheet" href="/assets/projects.css" />
            <Sidebar>
                <div className="projects-container">
                    <h1>Projects</h1>
                    <div style={{ marginBottom: "1rem" }}>
                        <button onClick={toggleForm} className="add-project-button">
                            {showForm ? "Cancel" : "Add New Project"}
                        </button>
                    </div>

                    {showForm && <AddProject/>}

                    <div className="feeds-container">
                        <ProjectFeeds title="Normal Projects" projects={normalProjects} />
                        <ProjectFeeds title="Checked Out Projects" projects={checkedoutProjects} />
                    </div>
                </div>

            </Sidebar>
        </>
    );
}