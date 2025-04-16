import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCALSTORAGE, ROUTES } from "../utils/constants";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE.AUTHTOKEN);
    const tokenCheck = () => {
      if (token) {
        setLoading(false);
      } else {
        navigate(ROUTES.LOGIN);
        setLoading(true);
      }
    };
    tokenCheck();
  }, [navigate]);

  return (
    <React.Fragment>{loading ? <h1>Loading</h1> : children}</React.Fragment>
  );
};

export default ProtectedRoute;
