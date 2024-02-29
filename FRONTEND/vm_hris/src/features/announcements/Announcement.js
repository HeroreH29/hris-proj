import { useNavigate } from "react-router-dom";

import { useGetAnnouncementsQuery } from "./announcementsApiSlice";

import React, { memo, useState } from "react";
import { Card } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";

const Announcement = ({ announcementId }) => {
  const { isHR, isAdmin, isOutletProcessor } = useAuth();

  // Variables below are used to simulate hover animation on card
  const [hovered, setHovered] = useState(false);

  const { announcement } = useGetAnnouncementsQuery("announcementsList", {
    selectFromResult: ({ data }) => ({
      announcement: data?.entities[announcementId],
    }),
  });

  const navigate = useNavigate();

  if (announcement) {
    const handleEdit = () => {
      if (isHR || isAdmin || isOutletProcessor)
        navigate(`/dashboard/announcements/${announcementId}`);
    };

    return (
      <>
        <Card
          border="dark"
          className="text-center mt-2 mb-2"
          bg={hovered ? "secondary" : ""}
          onClick={handleEdit}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Card.Body>
            <Card.Title>{announcement.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              from: {announcement.user}
            </Card.Subtitle>
            <Card.Text>
              {
                announcement.message /* .length > 30
                ? announcement.message.slice(0, 30) + "..."
                : announcement.message */
              }
            </Card.Text>
          </Card.Body>
          <Card.Footer className="text-muted">
            Date posted: {announcement.date}
          </Card.Footer>
        </Card>
      </>
    );
  } else
    return (
      <>
        <p>There are no announcements yet...</p>
      </>
    );
};

const memoizedAnnouncement = memo(Announcement);

export default memoizedAnnouncement;
