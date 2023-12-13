import React from "react";
import NewAnnouncementForm from "./NewAnnouncementForm";

import { useGetUsersQuery } from "../users/usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";

const NewAnnouncement = () => {
  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (users) {
    return <NewAnnouncementForm users={users} />;
  } else {
    return <PulseLoader color="#808080" />;
  }
};

export default NewAnnouncement;
