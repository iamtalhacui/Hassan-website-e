import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/signin" />;
  return children;
};

export default ProtectedRoute;