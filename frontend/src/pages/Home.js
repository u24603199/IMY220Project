// import React from "react";
// import Sidebar from "../components/SideBar";

// export default function Home(){
//     return(
//        <Sidebar>
//             <h1> Home </h1>
//         </Sidebar>
//     );
// }

import React, { useState } from "react";
import ProjectTile from "../components/ProjectTile";
import ProjectData from "../components/ProjectData";
import Sidebar from "../components/SideBar";

export default function Home() {
    const [projects, setProjects] = useState(ProjectData);

    return (
        <>
            <link rel="stylesheet" href="/assets/home.css" />
            <Sidebar>
                <div className="home-container">
                    <h1>Home</h1>
                    <div className="project-feed">
                        <div className="feed-header">
                            <h2 className="feed-title">Project Feed</h2>

                            <div className="feed-controls">
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    className="search-input"
                                />
                                <button className="filter-button">
                                    <span className="filter-icon">🔍</span>
                                </button>
                                <div className="scope-buttons">
                                    <button className="scope-button">Global</button>
                                    <button className="scope-button">Local</button>
                                </div>
                            </div>
                        </div>

                        <div className="project-tiles">
                            {projects.map(project => (
                                <ProjectTile key={project.id} project={project} />
                            ))}
                        </div>
                    </div>
                </div>
            </Sidebar>

        </>

    );
}

