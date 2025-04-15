import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Panels from "../pages/Panels/index";
import Profile from "../pages/Profile";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "../utils/constants";

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />,
  },

  {
    path: ROUTES.DASHBOARD,
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
        path: ROUTES.PROFILE,
        element: <Profile />,
      },
    ],
  },
]);

export default router;
