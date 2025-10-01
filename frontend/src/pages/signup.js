import React, { useState } from "react";
import "../../public/assets/styles.css";
import { useNavigate } from "react-router-dom";


export default function SignUp() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.username) {
            newErrors.username = "Username is required";
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponseMessage("");

        if (!validate()) return;

        try {
            const res = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();
            console.log("Signup response:", data);

            if (res.ok) {
                setResponseMessage(`Success ${data.message}`);
                setTimeout(() => navigate("/login"), 1500)
            } else {
                setResponseMessage(`Failed ${data.message || "Sign up failed."}`);
            }
        } catch (error) {
            setResponseMessage("Failed Could not connect to server.");
        }
    };

    return (
        <div className="page-layout">
            <div className="left-side content-centered">
                <h1 className="heading">
                    <span className="logo-title">Sign Up</span>
                </h1>
            </div>
            <div className="right-side">
                <form className="login-signup-form" onSubmit={handleSubmit} noValidate>
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        className="input-field"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    {errors.username && <p className="error-text">{errors.username}</p>}

                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        className="input-field"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        className="input-field"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}

                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="input-field"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

                    <button type="submit" className="aButton">Sign Up</button>

                    {responseMessage && (
                        <p
                            style={{
                                marginTop: "1rem",
                                color: responseMessage.startsWith("Success") ? "White" : "White",
                            }}
                        >
                            {responseMessage}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
