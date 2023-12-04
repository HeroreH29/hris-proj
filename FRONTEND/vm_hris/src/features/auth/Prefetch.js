import { store } from "../../app/store";
import { announcementsApiSlice } from "../announcements/announcementsApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import React from "react";

const Prefetch = () => {
  useEffect(() => {
    console.log("subscribing");
    const announcements = store.dispatch(
      announcementsApiSlice.endpoints.getAnnouncements.initiate()
    );
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());

    return () => {
      console.log("unsubscribing");
      announcements.unsubscribe();
      users.unsubscribe();
    };
  }, []);

  return <Outlet />;
};

export default Prefetch;
