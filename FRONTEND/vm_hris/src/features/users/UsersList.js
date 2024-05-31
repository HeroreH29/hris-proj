import React from "react";
import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Stack,
  OverlayTrigger,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUserLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import TooltipRenderer from "../../xtra_functions/TooltipRenderer";

const UsersList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isX } = useAuth();

  useTitle("User Settings | Via Mare HRIS");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <Spinner animation="border" />;

  if (isError) {
    content = <p className="text-danger">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;

    const tableContent = ids?.length
      ? ids.map((userId) => <User key={userId} userId={userId} />)
      : null;

    content = (
      <Container>
        <Row>
          <Col>
            <h3>User Settings</h3>
          </Col>
          <Col md="auto">
            <Stack direction="horizontal" gap={1}>
              <OverlayTrigger overlay={TooltipRenderer({ tip: `New User` })}>
                <Button
                  variant="outline-success"
                  onClick={() => navigate(`${location.pathname}/new`)}
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                </Button>
              </OverlayTrigger>
              {/* Hidden = UNDER DEVELOPMENT = */}
              <OverlayTrigger overlay={TooltipRenderer({ tip: `User Access` })}>
                <Button
                  variant="outline-primary"
                  onClick={() => navigate(`${location.pathname}/useraccess`)}
                >
                  <FontAwesomeIcon icon={faUserLock} />
                </Button>
              </OverlayTrigger>
            </Stack>
          </Col>
        </Row>
        <Table bordered striped hover className="align-middle ms-3 mt-3 mb-3">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">User level</th>
              <th scope="col">Account Status</th>
              <th scope="col">Online Status</th>
              {(isX.isHR || isX.isAdmin) && <th scope="col">Edit</th>}
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </Table>
      </Container>
    );
  }

  return content;
};

export default UsersList;
