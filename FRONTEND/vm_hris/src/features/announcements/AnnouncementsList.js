import React from "react";
import { useGetAnnouncementsQuery } from "./announcementsApiSlice";
import Announcement from "./Announcement";
import { Table, Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const AnnouncementsList = () => {
  const { isHR, isAdmin } = useAuth();
  const navigate = useNavigate();

  const {
    data: announcements,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAnnouncementsQuery("announcementsList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color="#808080" />;

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
      <>
        <Container style={{ maxHeight: "400px", overflowY: "scroll" }}>
          <Row>
            {/* <Col md="auto">
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/dashboard")}
              >
                <FontAwesomeIcon icon={faLeftLong} />
              </Button>
            </Col> */}
            <Col md="auto">
              <h3>HR Memos/Announcements</h3>
            </Col>
            {(isHR || isAdmin) && (
              <Col>
                <Button
                  variant="outline-primary"
                  onClick={() => navigate("/dashboard/announcements/new")}
                  className="float-end"
                  md="auto"
                >
                  <FontAwesomeIcon icon={faFileCirclePlus} />
                </Button>
              </Col>
            )}
          </Row>
          <Table
            responsive
            bordered
            striped
            hover
            className="align-middle ms-3 mt-3 mb-3 caption-top"
          >
            <caption>Click any announcement to view full message</caption>
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
  }
};

export default AnnouncementsList;
