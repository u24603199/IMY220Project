import React from 'react';
import ProjectTile from "../components/ProjectTile";

export default function ProjectFeeds({ title, projects }) {
    return (
        <div className="project-feed">
            <div className="feed-header">
                <h2 className="feed-title"> {title} </h2>
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
                {projects.map(project => (
                    <ProjectTile key={project.id} project={project} />
                ))}
            </div>
        </div>
    );
}