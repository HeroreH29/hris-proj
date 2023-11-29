import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";

const Welcome = () => {
  const date = new Date();
  const currentMonth = date.getMonth();

  const content = (
    <Container className="p-4">
      <h3>Dashboard</h3>
      <Row className="p-3">
        {/* Announcements */}
        <Col>
          <Row>
            <Col md={"auto"}>
              <h4>HR Memo/Announcements</h4>
              <small>{`(Click on any announcement to view)`}</small>
            </Col>
            <Col>
              <Button
                variant="outline-primary"
                type="button"
                /* onClick={() => navigate("/addAnnouncement")} */
              >
                Add
              </Button>
            </Col>
          </Row>
          <Row className="p-2">
            <ListGroup>
              <ListGroup.Item
                className="d-flex justify-content-center"
                action
                onClick={() => console.log("first")}
              >
                <h5>Memo/Announcement #1</h5>
              </ListGroup.Item>
            </ListGroup>
          </Row>
        </Col>
        <Col>
          <Row>
            <Col md={"auto"}>
              <h4>Birthday Celebrants for {currentMonth}</h4>
              <small>{`Greet them a happy birthday!`}</small>
            </Col>
          </Row>
          <Row className="p-2">
            <ListGroup>
              <ListGroup.Item
                className="d-flex justify-content-center"
                action
                onClick={() => console.log("first")}
              >
                <h5>Celebrant #1</h5>
              </ListGroup.Item>
            </ListGroup>
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
