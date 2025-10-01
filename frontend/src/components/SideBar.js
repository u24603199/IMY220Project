import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ children }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <>
            <link rel="stylesheet" href="/assets/sidebar.css" />
            <div className="app-layout">
                <aside className="sidebar">
                    <h2 className="sidebar-title">C.Flare</h2>
                    <nav className="sidebar-nav">
                        <Link to="/Home" className="nav-link">Home</Link>
                        <Link to="/Projects" className="nav-link">Projects</Link>
                        <Link to="/Profile" className="nav-link">Profile</Link>
                        <Link to="/Connections" className="nav-link">Connect</Link>
                        <Link to="/friends" className="nav-link">Friends</Link>
                    </nav>

                    <div className="logout-container">
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </aside>
                <main className="main-content">
                    {children}
                </main>
            </div>
        </>

    );
}
