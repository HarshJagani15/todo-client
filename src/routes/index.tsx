import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Panels from "../components/Panels/Index";
import Profile from "../components/Profile";
import ProtectedRoute from "../components/Auth/Guard";
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
