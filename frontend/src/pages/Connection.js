import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/SideBar";

export default function Connections() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch all users from your backend (or mock data)
        fetch("/api/auth/users")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load users.");
                return res.json();
            })
            .then((data) => {
                setUsers(data);
            })
            .catch((err) => {
                setError("Error loading users.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <link rel="stylesheet" href="/assets/Connections.css" />
            <Sidebar>
                <div className="connections-container">
                    <h1>All Users</h1>
                    <div className="user-list">
                        {users.map((user) => (
                            <div key={user.id} className="user-card">
                                <img
                                    src={user.profile.avatar}
                                    alt="User Avatar"
                                    className="user-avatar"
                                />
                                <div className="user-info">
                                    <h2>{user.username}</h2>
                                    <p>{user.email}</p>
                                    <Link to={`/Profile/${user.id}`}>View Profile</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Sidebar>
        </>

    );
}
