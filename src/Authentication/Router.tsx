import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout";
import Login from "../pages/login";
import Register from "../pages/Register";
import Panels from "../pages/Panels";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  // Public Routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Protected Routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Panels />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

export default router;
