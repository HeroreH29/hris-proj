import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useGetUserAccessesQuery } from "../users/userAccessApiSlice";

import React from "react";

const RequireAuth = ({ allowedUserLevels /* , allowedAccess */ }) => {
  const location = useLocation();
  const { userLevel } = useAuth();

  // const {
  //   data: userAccesses,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  // } = useGetUserAccessesQuery();

  // if (isSuccess) {
  //   const { ids, entities } = userAccesses;
  //   const matchingUserAccess = ids
  //     .filter((id) => entities[id].UserLevel === userLevel)
  //     .map((id) => entities[id])[0];
  // }

  const isUserAllowed = allowedUserLevels.includes(userLevel);

  if (isUserAllowed) {
    return <Outlet />;
  } else {
    if (userLevel) {
      return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }
    return <Navigate to="/" state={{ from: location }} replace />;
  }
};

export default RequireAuth;
