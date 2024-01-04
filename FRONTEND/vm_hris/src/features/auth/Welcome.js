import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import useTitle from "../../hooks/useTitle";
import useAuth from "../../hooks/useAuth";
import AnnouncementsList from "../announcements/AnnouncementsList";
import CelebrantsList from "../celebrants/CelebrantsList";

const Welcome = () => {
  const { status } = useAuth();
  useTitle(`${status} Dashboard | Via Mare HRIS`);

  // const date = new Date();
  // const currentMonth = date.toLocaleString("default", { month: "long" });
  // const navigate = useNavigate();

  const date = new Date();
  const currentMonth = date.getMonth() + 1;
  const monthName = date.toLocaleString("default", { month: "long" });

  const content = (
    <Container>
      <h3 className="pb-2">Dashboard</h3>
      <Row className="p-3">
        {/* Announcements */}
        <Col>
          <Row>
            <Col>
              {/* <Button
                className="p-3"
                variant="light"
                onClick={() => navigate("/dashboard/announcements")}
              >
                <h4>View HR Memo/Announcements</h4>
              </Button> */}
              <h3>HR Memos/Announcements</h3>
              <AnnouncementsList />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col>
              {/* <Button
                className="p-3"
                variant="light"
                onClick={() => navigate("/dashboard/celebrants")}
              >
                <h4>View Birthday Celebrants for {currentMonth}</h4>
              </Button> */}
              <h3>Birthday Celebrants for {monthName}</h3>
              <CelebrantsList />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <p>
        <Link to="/dash/announcements">View announcements</Link>
      </p>
      <p>
        <Link to="/dash/users">View user settings</Link>
      </p> */}
    </Container>
  );

  return content;
};

export default Welcome;
