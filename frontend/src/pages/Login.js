import React from "react";
import "../../public/assets/styles.css";
import { Link } from "react-router-dom"

export default function Login() {
    return (
        <div className="page-layout">
            <div className="left-side content-centered">
                <h1 className="heading">
                    <span className="logo-title">Login</span>
                </h1>
            </div>
            <div className="right-side">
                <form className="login-signup-form">
                    <label> Email </label>
                    <input type="email" id="email" name="email" className="input-field" required/>

                    <label> Password </label>
                    <input type="password" id="password" name="password" className="input-field" required/>

                    <Link to="#" className="aButton">Login</Link>
                </form>
            </div>
        </div>
    );
}
