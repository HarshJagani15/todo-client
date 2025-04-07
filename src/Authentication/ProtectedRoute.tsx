import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    (async () => {
      if (token) {
        setLoading(false);
      } else {
        navigate("/Login");
        setLoading(true);
      }
    })();
  }, [navigate]);

  return <>{loading ? <h1>Loading</h1> : children}</>;
};

export default ProtectedRoute;
