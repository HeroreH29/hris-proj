import { store } from "../../app/store";
import { announcementsApiSlice } from "../announcements/announcementsApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import React from "react";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      announcementsApiSlice.util.prefetch(
        "getAnnouncements",
        "announcementsList",
        { force: true }
      )
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", {
        force: true,
      })
    );
  }, []);

  return <Outlet />;
};

export default Prefetch;
