import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectTile({ project }) {
    const { image, name, description, downloads, favorites, commits, size } = project;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/projects/${project.id}`);
    };
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
                        <span>⭐ {favorites}</span>
                        <span>📝 {commits}</span>
                        <span>📦 {size}</span>
                    </div>
                </div>
            </div>
        </>

    );
}
