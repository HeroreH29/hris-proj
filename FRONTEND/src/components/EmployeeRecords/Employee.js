import { useNavigate } from "react-router-dom";

import React, { memo } from "react";

const Employee = ({ einfo }) => {
  const navigate = useNavigate();

  if (einfo) {
    const geninfo = einfo.GenInfo;
    const handleEdit = () => navigate(`/employeerecords/${einfo.EmployeeID}`);

    const status = geninfo.EmpStatus === "Y" ? "Active" : "Inactive";
    const statusClr =
      status === "Active"
        ? "fw-semibold text-success"
        : "fw-semibold text-danger";
    return (
      <tr onClick={handleEdit}>
        <td>{einfo.EmployeeID}</td>
        <td>{`${geninfo.LastName}, ${geninfo.FirstName} ${
          geninfo.MI ? geninfo.MI : ""
        }`}</td>
        <td>{geninfo.AssignedOutlet}</td>
        <td>{geninfo.JobTitle}</td>
        <td className={statusClr}>{status}</td>
      </tr>
    );
  } else return null;
};

const memoizedEmployee = memo(Employee);

export default memoizedEmployee;
