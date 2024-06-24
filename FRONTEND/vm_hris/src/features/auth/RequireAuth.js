import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import React from "react";

const RequireAuth = ({ allowedAccess = [] }) => {
  const location = useLocation();
  const { userLevel } = useAuth();

  if (allowedAccess.includes(userLevel) || !allowedAccess.length) {
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
