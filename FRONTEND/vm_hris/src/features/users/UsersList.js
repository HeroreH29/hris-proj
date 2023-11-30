import React from "react";
import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import { Table, Container } from "react-bootstrap";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

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
        <h2>User List</h2>
        <Table bordered striped hover className="align-middle">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">User level</th>
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
