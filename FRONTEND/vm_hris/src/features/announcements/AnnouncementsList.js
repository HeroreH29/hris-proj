import React from "react";
import { useGetAnnouncementsQuery } from "./announcementsApiSlice";
import Announcement from "./Announcement";
import { Container } from "react-bootstrap";
//import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const AnnouncementsList = () => {
  const { isHR, isAdmin } = useAuth();
  //const navigate = useNavigate();

  const {
    data: announcements,
    isLoading,
    isSuccess,
  } = useGetAnnouncementsQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <Spinner animation="border" />;

  let cardContent;
  if (isSuccess) {
    const { ids } = announcements;

    cardContent = ids?.length
      ? ids.map((announcementId) => (
          <Announcement key={announcementId} announcementId={announcementId} />
        ))
      : null;
  }

  content = (
    <>
      <Container
        className="border"
        style={{ maxHeight: "500px", overflowY: "scroll", maxWidth: "500px" }}
      >
        <small className="text-muted">
          {(isHR || isAdmin) && <>Click an announcement to edit</>}
        </small>
        {cardContent ? (
          cardContent
        ) : (
          <p className="fw-semibold text-center mt-2">
            No announcements yet...
          </p>
        )}
      </Container>
    </>
  );

  return content;
};

export default AnnouncementsList;
