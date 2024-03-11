import React from "react";
import { useParams } from "react-router-dom";
import EditAnnouncementForm from "./EditAnnouncementForm";
import { useGetAnnouncementsQuery } from "./announcementsApiSlice";
import { Spinner } from "react-bootstrap";

const EditAnnouncement = () => {
  const { id } = useParams();

  const { announcement } = useGetAnnouncementsQuery("announcementsList", {
    selectFromResult: ({ data }) => ({
      announcement: data?.entities[id],
    }),
  });

  if (!announcement) return <Spinner animation="border" />;

  const content = <EditAnnouncementForm announcement={announcement} />;

  return content;
};

export default EditAnnouncement;
