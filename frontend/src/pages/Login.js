import React, { useState } from "react";
import "../../public/assets/styles.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const validate = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid";
        }

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!validate()) return;

        try {
            const res = await fetch("http://localhost:3000/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            console.log("Signup response:", data);

            if (res.ok) {
                setMessage(data.message || "Login successful!");
                // Optionally store user/token in localStorage for future auth
                // localStorage.setItem("user", JSON.stringify(data.user));
            } else {
                setMessage(data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="page-layout">
            <div className="left-side content-centered">
                <h1 className="heading">
                    <span className="logo-title">Login</span>
                </h1>
            </div>
            <div className="right-side">
                <form className="login-signup-form" onSubmit={handleSubmit} noValidate>
                    <label>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}

                    <label>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && <p className="error-message">{errors.password}</p>}

                    <button type="submit" className="aButton">Login</button>

                    {message && <p className={message.includes("successful") ? "success-message" : "error-message"}>{message}</p>}
                </form>
            </div>
        </div>
    );
}
