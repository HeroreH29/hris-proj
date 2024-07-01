import React from "react";
import NewAnnouncementForm from "./NewAnnouncementForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { Spinner } from "react-bootstrap";

const NewAnnouncement = () => {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (users) {
    return <NewAnnouncementForm />;
  } else {
    return <Spinner animation="border" />;
  }
};

export default NewAnnouncement;
