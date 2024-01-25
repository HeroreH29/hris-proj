import React from "react";
import { useGetAnnouncementsQuery } from "./announcementsApiSlice";
import Announcement from "./Announcement";
import { Table, Container } from "react-bootstrap";
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
    isError,
    error,
  } = useGetAnnouncementsQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <Spinner animation="border" />;

  let tableContent;
  if (isError) {
    tableContent = (
      <tr>
        <td colSpan={5} className="text-secondary">
          {error.data.message}
        </td>
      </tr>
    );
  }

  if (isSuccess) {
    const { ids } = announcements;

    tableContent = ids?.length
      ? ids.map((announcementId) => (
          <Announcement key={announcementId} announcementId={announcementId} />
        ))
      : null;
  }

  content = (
    <>
      <Container className="border">
        <Table bordered striped hover className="align-middle mt-2 caption-top">
          <caption>Click any announcement to view full message </caption>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Message</th>
              <th scope="col">Date</th>
              <th scope="col">Author</th>
              {(isHR || isAdmin) && <th scope="col">Edit</th>}
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </Table>
      </Container>
    </>
  );

  return content;
};

export default AnnouncementsList;
