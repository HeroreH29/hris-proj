import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";

import React from "react";
import { Button } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";

const User = ({ userId }) => {
  const { isHR, isAdmin } = useAuth();

  const user = useSelector((state) => selectUserById(state, userId));

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/users/${userId}`);

    const userLevelString = String(user.userLevel);
    const userActiveString = user.active ? "Active" : "Inactive";
    const activeStringClr = user.active
      ? "fw-semibold text-success"
      : "fw-semibold text-danger";

    return (
      <tr>
        <td>{user.username}</td>
        <td>{userLevelString}</td>
        <td className={activeStringClr}>{userActiveString}</td>
        {(isHR || isAdmin) && (
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

export default User;
