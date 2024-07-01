import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import {
  faLeftLong,
  faEye,
  faEyeSlash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const UserFormLayout = ({ title, validated, onSaveUserClicked }) => {
  const navigate = useNavigate();
  return (
    <Container>
      <Row>
        <Col md="auto">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/users")}
          >
            <FontAwesomeIcon icon={faLeftLong} />
          </Button>
        </Col>
        <Col>
          <h3>{title} User</h3>
        </Col>
      </Row>
      <Form
        className="p-3"
        noValidate
        validated={validated}
        onSubmit={onSaveUserClicked}
      >
        {/* First name and last name */}
        <Row className="mb-3">
          <Form.Group as={Col} md={"4"}>
            <Form.Label className="fw-semibold">First Name</Form.Label>
            <Form.Control
              required
              type="text"
              disabled
              autoComplete="off"
              placeholder="First Name"
              value={selectedResult.FirstName}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={"4"}>
            <Form.Label className="fw-semibold">Last Name</Form.Label>
            <Form.Control
              required
              type="text"
              disabled
              autoComplete="off"
              placeholder="Last Name"
              value={selectedResult.LastName}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Row>
        {/* Branch/outlet and user group */}
        <Row className="mb-3">
          <Form.Group as={Col} md={"4"}>
            <Form.Label className="fw-semibold">Branch/Outlet</Form.Label>
            <Form.Control
              disabled
              required
              value={selectedResult.AssignedOutlet}
              placeholder="Branch/Outlet"
            />
            <Form.Control.Feedback type="invalid">
              Select an option
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={"4"}>
            <Form.Label className="fw-semibold">User Group</Form.Label>
            <Form.Select
              required
              value={userState.userGroup}
              onChange={onUserGroupChanged}
            >
              <option value="">Select group...</option>
              {userGroupOptions}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Select an option
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        {/* Employee id and user level */}
        <Row className="mb-3">
          <Form.Group as={Col} md={"4"}>
            <Form.Label className="fw-semibold">Employee ID</Form.Label>
            <Form.Control
              required
              autoComplete="off"
              disabled
              type="text"
              placeholder="Employee ID"
              value={selectedResult.EmployeeID}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={"4"}>
            <Form.Label className="fw-semibold">User Level</Form.Label>
            <Form.Select
              required
              value={userState.userLevel}
              onChange={onUserLevelChanged}
            >
              <option value="">Select level...</option>
              {userLevelOptions}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Select an option
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Button variant="outline-success" type="submit">
          Add User
        </Button>
      </Form>
    </Container>
  );
};

export default UserFormLayout;
