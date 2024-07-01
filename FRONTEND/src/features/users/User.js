import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useGetUsersQuery } from "./usersApiSlice";

import React, { memo } from "react";
import { Button } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";

const User = ({ userId }) => {
  const { isX } = useAuth();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/users/${userId}`);

    const userLevelString = String(user.userLevel);
    const userActiveString = user.active ? "Active" : "Inactive";
    const userOnlineString = user.online ? "Online" : "Offline";
    const activeStringClr = user.active
      ? "fw-semibold text-success"
      : "fw-semibold text-danger";
    const onlineStringClr = user.online
      ? "fw-semibold text-success"
      : "fw-semibold text-danger";

    return (
      <tr>
        <td>{user.username}</td>
        <td>{userLevelString}</td>
        <td className={activeStringClr}>{userActiveString}</td>
        <td className={onlineStringClr}>{userOnlineString}</td>
        {isX.isAdmin && (
          <td>
            <Button variant="outline-primary" onClick={handleEdit}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
          </td>
        )}
      </tr>
    );
  } else return null;
};

const memoizedUser = memo(User);

export default memoizedUser;
