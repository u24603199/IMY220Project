import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import SignUp from "./pages/signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import ProjectView from "./pages/ProjectView";
import Connections from "./pages/Connection"
import ProfileOther from "./pages/ProfileOther"
import FriendsPage from "./pages/FriendsPage";

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
        path: "/Profile",
        element: <Profile />
    },
    {
        path: "/Profile/:id",
        element: <ProfileOther/>
    },
    {
        path: "/Connections",
        element: <Connections />
    },
    {
        path: "/Projects",
        element: <Projects />
    },
    {
        path: "/Projects/:id",
        element: <ProjectView />
    },
    {
        path: "/friends",
        element: <FriendsPage />
    }
])

export default function App() {
    return (
        <RouterProvider router={router} />
    );
}