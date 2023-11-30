import React from "react";
import { useGetAnnouncementsQuery } from "./announcementsApiSlice";
import Announcement from "./Announcement";
import { Table, Container } from "react-bootstrap";

const AnnouncementsList = () => {
  const {
    data: announcements,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAnnouncementsQuery();

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="text-danger">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = announcements;

    const tableContent = ids?.length
      ? ids.map((announcementId) => (
          <Announcement key={announcementId} announcementId={announcementId} />
        ))
      : null;

    content = (
      <Container>
        <h3>HR Memos/Announcements</h3>
        <Table responsive bordered striped hover className="align-middle m-3">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Message</th>
              <th scope="col">Date</th>
              <th scope="col">Author</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </Table>
      </Container>
    );

    return content;
  }
};

export default AnnouncementsList;
