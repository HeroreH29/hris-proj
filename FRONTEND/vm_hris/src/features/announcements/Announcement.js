import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useGetAnnouncementsQuery } from "./announcementsApiSlice";

import React, { useState, memo } from "react";
import { Button, Modal } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";

const Announcement = ({ announcementId }) => {
  const { isHR, isAdmin } = useAuth();

  const { announcement } = useGetAnnouncementsQuery("announcementsList", {
    selectFromResult: ({ data }) => ({
      announcement: data?.entities[announcementId],
    }),
  });

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  if (announcement) {
    const handleEdit = () =>
      navigate(`/dashboard/announcements/${announcementId}`);

    return (
      <>
        <tr onClick={() => setShowModal(true)}>
          <td>{announcement.title}</td>
          <td>
            {announcement.message.length > 30
              ? announcement.message.slice(0, 30) + "..."
              : announcement.message}
            {/* {announcement.message} */}
          </td>
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

        {/* View full message modal */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{announcement.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="fw-semibold text-break">{announcement.message}</p>
          </Modal.Body>
          <Modal.Footer>
            <p className="fst-italic">{`Author: ` + announcement.user}</p>
          </Modal.Footer>
        </Modal>
      </>
    );
  } else return null;
};

const memoizedAnnouncement = memo(Announcement);

export default memoizedAnnouncement;
