import React from "react";
import { useParams } from "react-router-dom";
import EditRecordForm from "./EditRecordForm";

import { useGetGeninfosQuery } from "./recordsApiSlice";
import { Spinner } from "react-bootstrap";

const EditRecord = () => {
  const { id } = useParams();

  const { geninfo } = useGetGeninfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      geninfo: data?.entities[id],
    }),
  });

  if (!geninfo) return <Spinner animation="border" />;

  return <EditRecordForm geninfo={geninfo} id={id} />;
};

export default EditRecord;
