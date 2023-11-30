import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice";

import React from "react";
import { Button } from "react-bootstrap";

const User = ({ userId }) => {
  const user = useSelector((state) => selectUserById(state, userId));

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dashboard/users/${userId}`);

    const userLevelString = String(user.userLevel).replaceAll(",", ",", ",");

    return (
      <tr>
        <td>{user.username}</td>
        <td>{userLevelString}</td>
        <td>
          <Button variant="outline-primary" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
        </td>
      </tr>
    );
  } else return null;
};

export default User;
