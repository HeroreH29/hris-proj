import React from "react";

import { useParams } from "react-router-dom";
import EditAnnouncementForm from "./EditAnnouncementForm";
import { useGetAnnouncementsQuery } from "./announcementsApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const EditAnnouncement = () => {
  const { id } = useParams();

  // const announcement = useSelector((state) =>
  //   selectAnnouncementById(state, id)
  // );
  // const users = useSelector(selectAllUsers);
  // eslint-disable-next-line
  const { username, isAdmin, isHR } = useAuth();

  const { announcement } = useGetAnnouncementsQuery("announcementsList", {
    selectFromResult: ({ data }) => ({
      announcement: data?.entities[id],
    }),
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!announcement || !users?.length) return <PulseLoader color="#808080" />;

  const content = (
    <EditAnnouncementForm announcement={announcement} users={users} />
  );

  return content;
};

export default EditAnnouncement;
