import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectAnnouncementById } from "./announcementsApiSlice";

import React from "react";
import { Button } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";

const Announcement = ({ announcementId }) => {
  const { isHR, isAdmin } = useAuth();

  const announcement = useSelector((state) =>
    selectAnnouncementById(state, announcementId)
  );

  const navigate = useNavigate();

  if (announcement) {
    const handleEdit = () =>
      navigate(`/dashboard/announcements/${announcementId}`);

    return (
      <tr>
        <td>{announcement.title}</td>
        <td>{announcement.message}</td>
        <td>{announcement.date}</td>
        <td>{announcement.user}</td>
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

export default Announcement;
