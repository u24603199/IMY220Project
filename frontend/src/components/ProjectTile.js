import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectTile({ project }) {
    const { image, name, description, downloads, favorites, commits, size } = project;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/projects/${project.id}`);
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 KB';
        const kb = bytes / 1024;
        if (kb < 1024) {
            return kb.toFixed(2) + ' KB';
        } else {
            return (kb / 1024).toFixed(2) + ' MB';
        }
    }

    return (
        <>
            <link rel="stylesheet" href="/assets/projectTile.css" />
            <div className="project-tile">
                <div className="project-image-container" onClick={handleClick}>
                    <img src={image} alt={`${name} logo`} className="project-image" />
                </div>
                <div className="project-info">
                    <h3 className="project-name">{name}</h3>
                    <p className="project-description">{description}</p>
                    <div className="project-stats">
                        <span>⬇️ {downloads}</span>
                        <span>📝 {commits}</span>
                        <span>📦  {formatBytes(size)} </span>
                    </div>
                </div>
            </div>
        </>

    );
}
