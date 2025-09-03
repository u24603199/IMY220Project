import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ children }) {
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
                    </nav>

                    <div className="logout-container">
                        <button className="logout-button"> Logout </button>
                    </div>
                </aside>
                <main className="main-content">
                    {children}
                </main>
            </div>
        </>

    );
}
