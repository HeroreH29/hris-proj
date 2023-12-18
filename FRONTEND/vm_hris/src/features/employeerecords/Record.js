import { useNavigate } from "react-router-dom";

import {
  useGetGeninfosQuery,
  useGetPersonalinfosQuery,
} from "./recordsApiSlice";

import React, { memo } from "react";

const Record = ({ geninfoId }) => {
  const { geninfo } = useGetGeninfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      geninfo: data?.entities[geninfoId],
    }),
  });

  const navigate = useNavigate();

  if (geninfo) {
    const handleEdit = () => navigate(`/employeerecords/${geninfo.EmployeeID}`);

    const status = geninfo.EmpStatus === "Y" ? "Active" : "Inactive";
    const statusClr =
      status === "Active"
        ? "fw-semibold text-success"
        : "fw-semibold text-danger";

    return (
      <tr onClick={handleEdit}>
        <td>{geninfo.EmployeeID}</td>
        <td>{`${geninfo.LastName}, ${geninfo.FirstName} ${geninfo.MI}`}</td>
        <td>{geninfo.AssignedOutlet}</td>
        <td>{geninfo.JobTitle}</td>
        <td className={statusClr}>{status}</td>
      </tr>
    );
  } else return null;
};

const memoizedRecord = memo(Record);

export default memoizedRecord;
