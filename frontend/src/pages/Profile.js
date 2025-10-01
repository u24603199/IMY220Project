import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import ProjectTile from "../components/ProjectTile";
import UserDetails from "../components/UserDetails";

export default function Profile() {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            setError("User not logged in.");
            setLoading(false);
            return;
        }

        const rawUser = JSON.parse(storedUser);

        const normalizedUser = {
            id: rawUser.id,
            name: rawUser.username,
            email: rawUser.email,
            phone: rawUser.profile?.phone || "",
            dob: rawUser.profile?.dob || "",
            bio: rawUser.profile?.bio || "",
            avatar: rawUser.profile?.avatar,
            lastLogin: rawUser.lastLogin || "",
        };

        //console.log(normalizedUser);

        //console.log(JSON.parse(localStorage.getItem("user")))

        setUserDetails(normalizedUser);

        fetch(`api/projects/user/${rawUser.id}/projects`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load projects.");
                return res.json();
            })
            .then((data) => setProjects(data))
            .catch((err) => {
                console.error("Error loading user projects:", err);
                setError("Error loading user projects.");
            })
            .finally(() => setLoading(false));
    }, []);

    // useEffect(() => {
    //     if (userDetails) {
    //         console.log("Avatar URL after update: ", userDetails.avatar);
    //     }
    // }, [userDetails]);

    const formatLastLogin = (timestamp) => {
        if (!timestamp) return "Never";

        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    const toggleEdit = () => setIsEditing((prev) => !prev);

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <>
            <link rel="stylesheet" href="/assets/profile.css" />
            <Sidebar>
                <div className="home-container">
                    <h1>Profile</h1>
                    <div className="profile-header">
                        <div className="profile-info-left">
                            <img
                                src={userDetails.avatar}
                                alt="Profile"
                                className="profile-pic"
                                onError={(e) => {
                                    e.target.src = "/assets/images/Avatars/Logo.png";
                                }}
                            />

                            <div className="profile-stats">
                                <p>Last online: {formatLastLogin(userDetails?.lastLogin)}</p>
                            </div>
                        </div>

                        <div className="profile-name">
                            <h2>{userDetails?.name || "User's Name"}</h2>
                        </div>
                        <div
                            className="profile-edit"
                            onClick={toggleEdit}
                            style={{ cursor: "pointer" }}
                        >
                            <p> ✏️ </p>
                        </div>
                    </div>

                    <div className="profile-details-container">
                        <UserDetails
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            userDetails={userDetails}
                            setUserDetails={setUserDetails}
                        />

                        <div className="project-feed">
                            <div className="feed-header">
                                <h2 className="feed-title">Associated Projects</h2>
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
                                {projects.map((project) => (
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
