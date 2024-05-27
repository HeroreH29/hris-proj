import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import React from "react";

const RequireAuth = ({ exceptions = [], allowedAccess }) => {
  const location = useLocation();
  const { userLevel, isX } = useAuth(allowedAccess);

  if (exceptions.includes("Outlet Processor")) {
    return <Outlet />;
  } else if (isX.isUserAuthorized) {
    return <Outlet />;
  } else {
    if (userLevel) {
      return (
        <Navigate to="/dashboard" state={{ from: location }} replace={true} />
      );
    }
    return <Navigate to="/" state={{ from: location }} replace={true} />;
  }
};

export default RequireAuth;
