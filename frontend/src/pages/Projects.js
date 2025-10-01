import React, { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import ProjectFeeds from "../components/ProjectFeeds";
import AddProject from "../components/AddProject";

export default function Project() {
    const [showForm, setForm] = useState(false);
    const [userProjects, setUserProjects] = useState([]);
    const [checkedoutProjects, setCheckedoutProjects] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const toggleForm = () => setForm(prev => !prev);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const storedUser = localStorage.getItem("user");
                if (!storedUser) {
                    setError("User not logged in.");
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(storedUser);

                const userNotCheckedOutRes = await fetch(`http://localhost:3000/api/projects/notcheckout/${user.id}`);
                if (!userNotCheckedOutRes.ok) {
                    const errorData = await userNotCheckedOutRes.json();
                    setError(errorData.message || "Failed to load normal projects");
                    setLoading(false);
                    return;
                }
                const userNotCheckedOutProjects = await userNotCheckedOutRes.json();

                const userCheckedOutRes = await fetch(`http://localhost:3000/api/projects/checkout/${user.id}`);
                if (!userCheckedOutRes.ok) {
                    const errorData = await userCheckedOutRes.json();
                    setError(errorData.message || "Failed to load checked-out projects");
                    setLoading(false);
                    return;
                }
                const userCheckedOutProjects = await userCheckedOutRes.json();

                setUserProjects(userNotCheckedOutProjects);
                setCheckedoutProjects(userCheckedOutProjects);

            } catch (err) {
                console.error("Error fetching projects:", err);
                setError("Error fetching projects.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <>
            <link rel="stylesheet" href="/assets/projects.css" />
            <Sidebar>
                <div className="projects-container">
                    <h1>Projects</h1>

                    {error && <div className="error-message">{error}</div>}

                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            <div style={{ marginBottom: "1rem" }}>
                                <button onClick={toggleForm} className="add-project-button">
                                    {showForm ? "Cancel" : "Add New Project"}
                                </button>
                            </div>

                            {showForm && <AddProject />}

                            <div className="feeds-container">
                                <ProjectFeeds title="Normal Projects" projects={userProjects} />
                                <ProjectFeeds title="Checked Out Projects" projects={checkedoutProjects} />
                            </div>
                        </>
                    )}
                </div>
            </Sidebar>
        </>
    );
}
