import { useNavigate } from "react-router-dom";
import { useGetAnnouncementsQuery } from "./announcementsApiSlice";
import React, { memo, useState } from "react";
import { Card, Modal, Button } from "react-bootstrap";

const Announcement = ({ announcementId, useAuth }) => {
  const { isHR, isAdmin } = useAuth();

  // Variable to simulate hover animation on card
  const [hovered, setHovered] = useState(false);

  // Variable for announcement modal
  const [showModal, setShowModal] = useState(false);

  const { announcement } = useGetAnnouncementsQuery("announcementsList", {
    selectFromResult: ({ data }) => ({
      announcement: data?.entities[announcementId],
    }),
  });

  const navigate = useNavigate();

  if (announcement) {
    return (
      <>
        <Card
          border="dark"
          className="text-center mt-2 mb-2"
          bg={hovered ? "secondary-subtle" : ""}
          onClick={() => setShowModal(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Card.Body>
            <Card.Title>{announcement.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              from: {announcement.user}
            </Card.Subtitle>
            <Card.Text>{announcement.message}</Card.Text>
          </Card.Body>
          <Card.Footer className="text-muted">
            Date posted: {announcement.date}
          </Card.Footer>
        </Card>

        {/* MODAL */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{announcement.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{announcement.message}</Modal.Body>
          <Modal.Footer>
            {(isHR || isAdmin) && (
              <Button
                variant="outline-primary"
                onClick={() =>
                  navigate(`/dashboard/announcements/${announcementId}`)
                }
              >
                Edit
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
};

const memoizedAnnouncement = memo(Announcement);

export default memoizedAnnouncement;
