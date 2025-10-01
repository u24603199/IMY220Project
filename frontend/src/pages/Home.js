
import React, { useEffect, useState } from "react";
import ProjectTile from "../components/ProjectTile";
import Sidebar from "../components/SideBar";

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [scope, setScope] = useState("local");
    const [currentUser, setCurrentUser] = useState(null);


    //Get user of local sotrage
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setCurrentUser(JSON.parse(userStr))
        }
    }, []);

    useEffect(() => {
        if(!currentUser) return;

        async function fetchProjects(){
            try{
                let url = 
                    scope === "global"
                        ? "http://localhost:3000/api/projects"
                        : `http://localhost:3000/api/projects/local/${currentUser.id}`;

                const res = await fetch(url);
                const data = await res.json();
                setProjects(data);
            }catch(err){
                console.log("Error fetching projects" + err);
                setProjects([]);
            }
        }

        fetchProjects();
    }, [scope, currentUser]);

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
                                    <button className="scope-button" onClick={() => setScope("global")}>Global</button>
                                    <button className="scope-button" onClick={() => setScope("local")}>Local</button>
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