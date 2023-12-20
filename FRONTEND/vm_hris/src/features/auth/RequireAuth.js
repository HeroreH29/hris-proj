import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import React from "react";

const RequireAuth = ({ allowedUserLevels }) => {
  const location = useLocation();
  const { userLevel } = useAuth();

  const isUserAllowed = allowedUserLevels.includes(userLevel);

  if (isUserAllowed) {
    return <Outlet />;
  } else {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
