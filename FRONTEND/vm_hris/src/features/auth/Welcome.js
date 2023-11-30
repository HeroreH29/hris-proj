import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

const Welcome = () => {
  const date = new Date();
  const currentMonth = date.toLocaleString("default", { month: "long" });
  const navigate = useNavigate();

  const content = (
    <Container>
      <h3>Dashboard</h3>
      <Row className="p-3">
        {/* Announcements */}
        <Col>
          <Row>
            <Col md={"auto"}>
              <Button
                className="p-3"
                variant="light"
                onClick={() => navigate("/dashboard/announcements")}
              >
                <h4>View HR Memo/Announcements</h4>
              </Button>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col md={"auto"}>
              <Button
                className="p-3"
                variant="light"
                onClick={() => navigate("/dashboard/celebrants")}
              >
                <h4>View Birthday Celebrants for {currentMonth}</h4>
              </Button>
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
