import React, { useState } from "react";

export default function UserDetails({ isEditing, setIsEditing }) {
    const [userDetails, setUserDetails] = useState({
        name: "User's Name",
        phone: "111111111",
        email: "bob@bob.com",
        dob: "2000/01/01",
        bio: "Lorem Ipsum"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    //Add saveChanges later

    return (
        <div className="profile-details">
            {isEditing ? (
                <form className="edit-form">
                    <div className="contact-info">
                        <h3>Edit Contact Information</h3>
                        <p><strong>Phone:</strong>
                            <input
                                type="text"
                                name="phone"
                                value={userDetails.phone}
                                onChange={handleChange}
                            />
                        </p>
                        <p><strong>Email:</strong>
                            <input
                                type="email"
                                name="email"
                                value={userDetails.email}
                                onChange={handleChange}
                            />
                        </p>
                        <p><strong>D.O.B:</strong>
                            <input
                                type="data"
                                name="dob"
                                value={userDetails.dob}
                                onChange={handleChange}
                            />
                        </p>
                    </div>
                    <div className="user-bio">
                        <h3>Edit Bio</h3>
                        <textarea
                            name="bio"
                            value={userDetails.bio}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
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
