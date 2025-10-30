import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { ToastContainer } from "react-toastify";
import React from "react";

const App = () => {
  return (
    <React.Fragment>
      <ToastContainer autoClose={3000} />
      <RouterProvider router={router} />
    </React.Fragment>
  );
};

export default App;
