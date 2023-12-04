import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewAnnouncementForm from "./NewAnnouncementForm";

const NewAnnouncement = () => {
  const users = useSelector(selectAllUsers);

  const content = users ? (
    <NewAnnouncementForm users={users} />
  ) : (
    <p>Loading...</p>
  );

  return content;
};

export default NewAnnouncement;
