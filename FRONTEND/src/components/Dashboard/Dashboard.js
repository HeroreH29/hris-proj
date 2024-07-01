import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import useAuth from "../../hooks/useAuth";
import AnnouncementsList from "../../features/announcements/AnnouncementsList";
import CelebrantsList from "../../features/celebrants/CelebrantsList";

const Dashboard = () => {
  const { isX, userLevel } = useAuth();
  useTitle(`${userLevel} Dashboard | HRIS Project`);

  const navigate = useNavigate();

  const date = new Date();
  const monthName = date.toLocaleString("default", { month: "long" });

  const content = (
    <Container>
      <h3 className="pb-2">Dashboard</h3>
      <Row className="p-3">
        {/* Announcements */}
        <Col>
          <h3>
            HR Memos/Announcements{" "}
            {(isX.isProcessor || isX.isAdmin) && (
              <>
                <Button
                  className="float-end"
                  variant="outline-primary"
                  onClick={() => navigate("/dashboard/announcements/new")}
                >
                  <FontAwesomeIcon icon={faFileCirclePlus} />
                </Button>
              </>
            )}
          </h3>
          <small className="text-muted">
            {(isX.isProcessor || isX.isAdmin) && (
              <>Click an announcement to edit</>
            )}
          </small>
          <AnnouncementsList />
        </Col>
        <Col>
          <h3>Birthday Celebrants for {monthName}</h3>
          {/* <CelebrantsList /> */}
        </Col>
      </Row>
    </Container>
  );

  return content;
};

export default Dashboard;