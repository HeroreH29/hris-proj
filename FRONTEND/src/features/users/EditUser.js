import React from "react";
import { useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";

import { useGetUsersQuery } from "./usersApiSlice";
import { Spinner } from "react-bootstrap";

const EditUser = () => {
  const { id } = useParams();

  // const user = useSelector((state) => selectUserById(state, id));
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  if (!user) return <Spinner animation="border" />;

  const content = <EditUserForm user={user} />;

  return content;
};

export default EditUser;
