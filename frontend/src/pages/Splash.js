import React from "react";
import PersonList from "../components/PersonList";
import { Link } from "react-router-dom"

// const initialPeopleList = [
//     { name: "Troy", surname: "Barnes" },
//     { name: "Abed", surname: "Nadir" }
// ];

export default function Splash() {
    return (
        <>
         <link rel="stylesheet" href="/assets/styles.css" />
         <div className="page-layout">
            <div className="left-side content-centered">
                <h1 className="heading">
                    <span className="logo-title">C.Flare</span> <br />
                    <span className="tagline">The version control of choice</span>
                </h1>
                <img src="/assets/images/Logo.png" alt="Logo" className="LogoImage" />
            </div>
            <div className="right-side">
                <div className="button-container">
                    <Link to="/login" className="aButton">Login</Link>
                    <Link to="/signup" className="aButton">Sign Up</Link>
                </div>
            </div>
        </div>
        </>
        // <PersonList people={initialPeopleList} /> //Goes within the div
    );
}
