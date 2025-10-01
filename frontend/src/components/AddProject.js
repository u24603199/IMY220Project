import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProject() {
    const [message, setMessage] = useState("");
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch("http://localhost:3000/api/projects");
                const data = await res.json();
                setProjects(data);
            } catch (err) {
                console.error("Failed to fetch projects", err);
            }
        }

        fetchProjects();
    }, []);

    const [formData, setFormData] = useState({
        title: "",
        description: ""
    });

    const currentUser = JSON.parse(localStorage.getItem("user"))?.name || "Unknown User";
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id || null;


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const getNextId = () => {
        if (!projects || projects.length === 0) return 1;
        return Math.max(...projects.map(p => p.id)) + 1;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newProject = {
            id: getNextId,
            name: formData.title,
            description: formData.description,
            downloads: 0,
            favorites: 0,
            commits: 0,
            size: "",
            image: "/assets/images/Logo2.png",
            checkedout: false,
            author: currentUser,
            authorId: currentUserId,
            createdAt: new Date().toISOString().split("T")[0],
            message: "",
            files: []
        };

        try {
            const response = await fetch("http://localhost:3000/api/projects/newProject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newProject)
            });

            if (response.ok) {
                const data = await response.json();
                setMessage("Project created successfully!");
                setFormData({ title: "", description: "" });
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message || "Failed to create project"}`);
            }

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            setMessage("Network error: Unable to create project");
            console.error("Error creating project:", error);
        }
    };

    return (
        <form className="add-project-form" onSubmit={handleSubmit}>
            <h2>Create New Project</h2>

            <div>
                <label>Project Title:</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter project title"
                />
            </div>

            <div>
                <label>Description:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description"
                />
            </div>

            <div>
                <button type="submit" className="submit-button">
                    Submit
                </button>
            </div>
        </form>
    );
}
