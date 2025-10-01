import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/SideBar";
import ProjectTile from "../components/ProjectTile";

export default function ProfileOther() {
    const { id } = useParams();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = Number(storedUser?.id);
    const [userDetails, setUserDetails] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/auth/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("User not found.");
                return res.json();
            })
            .then((data) => {
                setUserDetails(data);
            })
            .catch(() => {
                setError("Error loading user details.");
            })
            .finally(() => setLoading(false));

        fetch(`/api/projects/user/${id}/projects`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load projects.");
                return res.json();
            })
            .then((data) => setProjects(data))
            .catch((err) => {
                console.error("Error loading user projects:", err);
                setError("Error loading user projects.");
            });
    }, [id]);

    const formatLastLogin = (timestamp) => {
        if (!timestamp) return "Never";
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    const handleFriendRequest = async () => {
        try {
            const response = await fetch("/api/auth/friend/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderId: currentUserId,
                    receiverId: parseInt(id),
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to send friend request");
            }

            alert("Friend request sent!");
        } catch (error) {
            // console.error("Error sending friend request:", error.message);
            // alert("Failed to send friend request");
        }
    };

    const isOwnProfile = Number(userDetails?.id) === currentUserId;

    // console.log("currentUserId (localStorage):", currentUserId);
    // console.log("userDetails.id (API):", userDetails?.id);
    // console.log("isOwnProfile:", isOwnProfile);
    // console.log("Stored user from localStorage:", storedUser);

    if (loading) return <div>Loading profile...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <>
            <link rel="stylesheet" href="/assets/profile.css" />
            <Sidebar>
                <div className="home-container">
                    <h1>{userDetails?.username}'s Profile</h1>

                    <div className="profile-header">
                        <div className="profile-info-left">
                            <img
                                src={userDetails?.profile?.avatar || "/assets/images/Avatars/Logo.png"}
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
                            <h2>{userDetails?.username || "User's Name"}</h2>
                        </div>

                        {!isOwnProfile && (
                            <button className="friend-request-btn" onClick={handleFriendRequest}>
                                🤝 Add Friend
                            </button>
                        )}

                    </div>

                    <div className="profile-details-container">
                        <div className="profile-details">
                            <div className="contact-info">
                                <h3>Contact Information</h3>
                                <p><strong>Phone:</strong> {userDetails?.profile?.phone || "N/A"}</p>
                                <p><strong>Email:</strong> {userDetails?.email || "N/A"}</p>
                                <p><strong>D.O.B:</strong> {userDetails?.profile?.dob || "N/A"}</p>
                            </div>

                            <div className="user-bio">
                                <h3>Bio</h3>
                                <p>{userDetails?.profile?.bio || "No bio available."}</p>
                            </div>
                        </div>

                        <div className="project-feed">
                            <div className="feed-header">
                                <h2 className="feed-title">Associated Projects</h2>
                                <div className="feed-controls">
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        className="search-input"
                                    // Optional: add search/filter logic later
                                    />
                                    <button className="filter-button">
                                        <span className="filter-icon">🔍</span>
                                    </button>
                                </div>
                            </div>

                            <div className="project-tiles">
                                {projects.length > 0 ? (
                                    projects.map((project) => (
                                        <ProjectTile key={project.id} project={project} />
                                    ))
                                ) : (
                                    <p>No projects found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Sidebar>
        </>
    );
}
