import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { useNavigate } from "react-router-dom";


export default function Projectview() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const [editedImageFile, setEditedImageFile] = useState(null);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");
  const [existingFiles, setExistingFiles] = useState([]);


  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;
  const canEdit = project?.authorId === currentUserId;

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`http://localhost:3000/api/projects/${id}`);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error fetching project: ${errorText}`);
        }

        const data = await res.json();
        setProject(data);
        setEditedTitle(data.name);
        setEditedImage(data.image);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  const handleCheckToggle = async () => {
    setIsChecking(true);
    try {
      // Decide which endpoint to call based on current checkedout status
      const endpoint = checkedout
        ? `http://localhost:3000/api/projects/${id}/checkin`
        : `http://localhost:3000/api/projects/${id}/checkout`;

      const method = "POST";

      const res = await fetch(endpoint, { method });

      if (!res.ok) {
        throw new Error("Failed to update project status");
      }

      // Update project state after success
      setProject((prev) => ({ ...prev, checkedout: !checkedout }));
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project")) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`DELETE FAILED: ${errorText}`);
      }

      setTimeout(() => {
        navigate("/projects");
      }, 1500);
    } catch (err) {
      console.error(err.message);
      setIsDeleting(false);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      //console.log("Dropped file:", file);

      if (file.type.startsWith("image/")) {
        setEditedImageFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
          setEditedImage(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please drop an image file");
      }
    }
  };


  const handleEditToggle = () => setIsEditing(true);

  const handleDownload = () => {
    window.open(`http://localhost:3000/api/projects/${id}/download`, "_blank");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(project.name);
    setEditedImage(project.image);
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

  const handleSaveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editedTitle);

      if (editedImageFile) {
        formData.append("image", editedImageFile);
        // Log FormData contents using forEach or entries()
        // formData.forEach((value, key) => {
        //   console.log(key, value);
        // });
      }

      const res = await fetch(`http://localhost:3000/api/projects/${id}/updateWithImage`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save changes");

      const updatedProject = await res.json();
      setProject(updatedProject);
      setIsEditing(false);
    } catch (err) {
      setError("Update failed.");
      console.error(err.message);
    }
  };

  const calculateTotalSize = (files) => {
    return files.reduce((totalSize, file) => totalSize + file.size, 0);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    //console.log(newFiles)
    setFilesToUpload(newFiles);
  };


  const handleCommitMessageChange = (e) => {
    setCommitMessage(e.target.value);
  };

  const handleSubmit = async () => {
    // Validate commit message
    if (!commitMessage) {
      alert("Commit message cannot be empty!");
      return;
    }

    // If no files are selected, show an error message
    if (filesToUpload.length === 0) {
      alert("Please select files to upload!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      filesToUpload.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("commitMessage", commitMessage);

      const totalSize = calculateTotalSize([...existingFiles, ...filesToUpload]);

      const res = await fetch(`http://localhost:3000/api/projects/${id}/uploadFiles`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("File upload failed.");
      }

      const updateRes = await fetch(`http://localhost:3000/api/projects/${id}/updateSize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newSize: totalSize,
          commitMessage,
          commits: (project.commits || 0) + 1,
        }),

      });

      if (!updateRes.ok) {
        throw new Error("Failed to update project size and commit.");
      }


      const updatedProject = await updateRes.json();
      setFilesToUpload([]);
      setCommitMessage("");
      alert("Files uploaded and project updated successfully!");
      navigate("/Projects");
    } catch (err) {
      setError(err.message);
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };




  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!project) return <div>Project does not exist</div>;

  const {
    image,
    name,
    description,
    downloads,
    commits,
    size,
    createdAt = "2025-01-01",
    author = "Unknown",
    message = "No message",
    files = [],
    checkedout = false,
  } = project;

  return (
    <>
      <link rel="stylesheet" href="/assets/projectView.css" />
      <Sidebar>
        <div className="project-view-container">
          <div className="project-header">
            <img
              src={editedImage.startsWith("data:") ? editedImage : `http://localhost:3000${editedImage}`}
              alt={`${name} logo`}
              className="project-header-image"
            />
            <div className="project-meta">
              {isEditing ? (
                <>
                  <input
                    className="edit-project-name-input"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />

                  <div
                    onDrop={handleImageDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="drag-drop-box"
                  >
                    {editedImage ? (
                      <img src={editedImage} alt="Dropped" />
                    ) : (
                      <span>🖼️ Drop image here</span>
                    )}
                  </div>

                  <div className="action-buttons">
                    <button onClick={handleSaveEdit} className="checkout-button">
                      💾 Save
                    </button>
                    <button onClick={handleCancelEdit} className="delete-button">
                      ✖ Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="project-title">{name}</h1>
                  <p><strong>Author:</strong> {author}</p>
                  <p><strong>Created on:</strong> {createdAt}</p>

                  {canEdit && (
                    <div className="action-buttons">
                      {canEdit && (
                        <>
                          <button
                            onClick={handleCheckToggle}
                            disabled={isChecking}
                            className="checkout-button"
                          >
                            {isChecking
                              ? "Processing..."
                              : checkedout
                                ? "✅ Check In"
                                : "📥 Check Out"}
                          </button>

                          <button
                            onClick={handleEditToggle}
                            className="download-button"
                            disabled={isChecking || isDeleting}
                          >
                            ✏️ Edit
                          </button>

                          <button
                            onClick={handleDelete}
                            className="delete-button"
                            disabled={isChecking || isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "🗑️ Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  <button
                    onClick={handleDownload}
                    className="dwnl-button"
                    disabled={isChecking || isDeleting}
                  >
                    ⬇️ Download All
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="project-description">
            <h3>Description</h3>
            <p>{description}</p>
          </div>

          <div className="project-message">
            <h3>Commit Message</h3>
            <p>{message}</p>
            {checkedout && !isEditing && canEdit && (
              <div className="commit-message-input">
                <textarea value={commitMessage}
                  onChange={handleCommitMessageChange}
                  placeholder="Enter your commit message..."
                  disabled={isChecking || isDeleting} />
              </div>
            )} </div>
          <div className="project-stats">
            <span>⬇️ {downloads} Downloads</span>
            <span>📝 {commits} Commits</span>
            <span>📦 {formatBytes(size)}</span>
          </div>

          <div className="project-files">
            <h2>📁 Files</h2>
            <ul>
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  <div>
                    <strong>{file.name}</strong>
                    <p>{file.message || "No description"}</p>
                  </div>
                  <span className="file-date">🕒 {file.uploadTime}</span>
                </li>
              ))}
            </ul>

            {checkedout && !isEditing && canEdit && (
              <div className="file-upload-section">
                <h3>Upload New Files</h3>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={isChecking || isDeleting}
                  id="file-input"
                />
                <div className="action-buttons">
                  <button
                    onClick={handleSubmit}
                    disabled={isChecking || isDeleting || !commitMessage}
                    className="upload-button"
                  >
                    {isChecking ? "Uploading..." : "Upload Files"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Sidebar>
    </>
  );
}