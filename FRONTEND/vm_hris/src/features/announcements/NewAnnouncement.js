import React from "react";
import NewAnnouncementForm from "./NewAnnouncementForm";

import { useGetAnnouncementsQuery } from "../announcements/announcementsApiSlice";
import PulseLoader from "react-spinners/PulseLoader";

const NewAnnouncement = () => {
  const { users } = useGetAnnouncementsQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!users?.length) return <PulseLoader color="#FFF" />;

  const content = <NewAnnouncementForm users={users} />;

  return content;
};

export default NewAnnouncement;
