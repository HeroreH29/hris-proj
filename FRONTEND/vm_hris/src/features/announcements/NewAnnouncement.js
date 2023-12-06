import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewAnnouncementForm from "./NewAnnouncementForm";

const NewAnnouncement = () => {
  const users = useSelector(selectAllUsers);

  if (!users?.length) return <p>Not Currently Available</p>;

  const content = <NewAnnouncementForm users={users} />;

  return content;
};

export default NewAnnouncement;
