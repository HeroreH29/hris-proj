import React from "react";
import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import { Table, Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const navigate = useNavigate();

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

  if (isLoading) content = <p>Loading...</p>;

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
            <h3>User List</h3>
          </Col>
          <Col md="auto">
            <Button
              variant="outline-primary"
              onClick={() => navigate("/users/new")}
            >
              <FontAwesomeIcon icon={faAdd} />
              {` Add new user`}
            </Button>
          </Col>
        </Row>
        <Table bordered striped hover className="align-middle ms-3 mt-3 mb-3">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">User level</th>
              <th scope="col">Status</th>
              <th scope="col">Edit</th>
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
