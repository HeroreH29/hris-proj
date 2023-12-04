import React from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAnnouncementById } from "./announcementsApiSlice";
import { selectAllUsers } from "../users/usersApiSlice";
import EditAnnouncementForm from "./EditAnnouncementForm";

const EditAnnouncement = () => {
  const { id } = useParams();

  const announcement = useSelector((state) =>
    selectAnnouncementById(state, id)
  );
  const users = useSelector(selectAllUsers);

  const content =
    announcement && users ? (
      <EditAnnouncementForm announcement={announcement} users={users} />
    ) : (
      <p>Loading...</p>
    );

  return content;
};

export default EditAnnouncement;
