import React from "react";
import { Outlet, useParams, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faPlus } from "@fortawesome/free-solid-svg-icons";
import useTitle from "../../hooks/useTitle";

const ContentLayout = ({ backTo = "", add = false, update = false }) => {
  const { id, employeeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isNewUser = location.pathname.includes("new");
  const isEditUser = !isNewUser && (id || employeeId);

  let title = "";
  if (isNewUser) {
    title = "New User";
  } else if (isEditUser) {
    title = "Edit User";
  } else {
    title = "Users";
  }

  return (
    <Container>
      <Row>
        {/* Back button */}
        {(isNewUser || isEditUser) && (
          <Col md="auto">
            <Button
              variant="outline-secondary"
              onClick={() => navigate(backTo)}
            >
              <FontAwesomeIcon icon={faLeftLong} />
            </Button>
          </Col>
        )}
        {/* Content title */}
        <Col>
          <h3>{title}</h3>
        </Col>
        {/* Extra buttons */}
        <Col md="auto">
          {add && !isNewUser && (
            <Button variant="outline-primary">
              <FontAwesomeIcon
                icon={faPlus}
                onClick={() => navigate(location.pathname + "/new")}
              />
            </Button>
          )}
        </Col>
      </Row>
      <Outlet />
    </Container>
  );
};

export default ContentLayout;
