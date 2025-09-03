import React from "react";

export default function AddProject() {
    return (
        <form className="add-project-form">
            <h2>Create New Project</h2>

            <div>
                <label>Project Title:</label>
                <input type="text" name="title" placeholder="Enter project title" />
            </div>

            <div>
                <label>Description:</label>
                <textarea name="description" placeholder="Enter project description"></textarea>
            </div>

            <div>
                <button type="button" className="submit-button">
                    Submit
                </button>
            </div>
        </form>
    )
}