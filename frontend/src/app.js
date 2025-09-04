import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import SignUp from "./pages/signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import ProjectView from "./pages/ProjectView";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Splash />
    },
    {
        path: "/Login",
        element: <Login />
    },
    {
        path: "/SignUp",
        element: <SignUp />
    },
    {
        path: "/Home",
        element: <Home />
    },
    {
        path: "/Profile/:id?",
        element: <Profile />
    },
    {
        path: "/Projects",
        element: <Projects />
    },
    {
        path: "/Projects/:id",
        element: <ProjectView />
    }
])

export default function App() {
    return (
        <RouterProvider router={router} />
    );
}