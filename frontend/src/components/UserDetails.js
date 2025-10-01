import React, { useState } from "react";

export default function UserDetails({ isEditing, setIsEditing, userDetails, setUserDetails }) {
    const [newProfilePic, setNewProfilePic] = useState(null);

    const handleFileChange = (e) => {
        setNewProfilePic(e.target.files[0]);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        //console.log("Save clicked");

        try {
            let imageUrl = userDetails.profilePic;

            if (newProfilePic) {
                //console.log("Uploading image...");

                const formData = new FormData();
                formData.append("image", newProfilePic);

                const res = await fetch(`/api/auth/${userDetails.id}/uploadProfilePic`, {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error("Upload failed");

                const data = await res.json();
                imageUrl = data.imageUrl;

                //console.log("Image uploaded, new URL:", imageUrl);
            }

            //console.log("Sending profile update fetch...");

            const res = await fetch(`/api/auth/${userDetails.id}/updateProfile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: userDetails.phone,
                    email: userDetails.email,
                    dob: userDetails.dob,
                    bio: userDetails.bio,
                }),
            });
            //console.log("Updating profile with:", { phone: userDetails.phone, email: userDetails.email, dob: userDetails.dob, bio: userDetails.bio });
            if (!res.ok) throw new Error("Failed to update profile");

            const updatedUser = await res.json();

            //console.log("Profile updated successfully", updatedUser);

            setUserDetails((prev) => ({
                ...prev,
                profilePic: imageUrl,
                ...updatedUser.user,
            }));

            localStorage.setItem(
                "user",
                JSON.stringify({ ...userDetails, profilePic: imageUrl, ...updatedUser.user })
            );

            setIsEditing(false);
        } catch (err) {
            console.error("Something crashed during handleSave:", err);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({ ...prev, [name]: value }));
    };

    if (!userDetails) return <p>Loading user details...</p>;

    //Add saveChanges later

    return (
        <div className="profile-details">
            {isEditing ? (
                <form className="edit-form" onSubmit={handleSave}>
                    <div className="contact-info">
                        <h3>Edit Contact Information</h3>
                        <p>
                            <strong>Phone:</strong>
                            <input
                                type="text"
                                name="phone"
                                value={userDetails.phone || ""}
                                onChange={handleChange}
                            />
                        </p>
                        <p>
                            <strong>Email:</strong>
                            <input
                                type="email"
                                name="email"
                                value={userDetails.email || ""}
                                onChange={handleChange}
                            />
                        </p>
                        <p>
                            <strong>D.O.B:</strong>
                            <input
                                type="date"
                                name="dob"
                                value={userDetails.dob || ""}
                                onChange={handleChange}
                            />
                        </p>
                    </div>

                    <div className="user-bio">
                        <h3>Edit Bio</h3>
                        <textarea
                            name="bio"
                            value={userDetails.bio || ""}
                            onChange={handleChange}
                            rows="6"
                            cols="50"
                        />
                    </div>

                    <div className="profile-actions">
                        <div className="file-upload">
                            <label>Profile Picture</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {newProfilePic && <p>Selected file: {newProfilePic.name}</p>}
                        </div>

                        <div className="button-group">
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                </form>

            ) : (
                <>
                    <div className="contact-info">
                        <h3>Contact Information</h3>
                        <p><strong>Phone:</strong> {userDetails.phone}</p>
                        <p><strong>Email:</strong> {userDetails.email}</p>
                        <p><strong>D.O.B:</strong> {userDetails.dob}</p>
                    </div>
                    <div className="user-bio">
                        <h3>Bio</h3>
                        <p>{userDetails.bio}</p>
                    </div>
                </>
            )}
        </div>
    );
}
