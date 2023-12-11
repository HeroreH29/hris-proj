import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import React from "react";

const RequireAuth = ({ allowedUserLevels }) => {
  const location = useLocation();
  const { userLevel } = useAuth();

  const content = allowedUserLevels.includes(userLevel) ? (
    <Outlet />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );

  return content;
};

export default RequireAuth;
