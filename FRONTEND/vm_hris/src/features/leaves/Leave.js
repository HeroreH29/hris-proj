import React, { memo } from "react";
import { useGetLeavesQuery } from "./leavesApiSlice";
import { useNavigate } from "react-router-dom";

const Leave = ({ leaveId }) => {
  const navigate = useNavigate();

  const { leave } = useGetLeavesQuery("leavesList", {
    selectFromResult: ({ data }) => ({
      leave: data?.entities[leaveId],
    }),
  });

  if (leave) {
    let approve;
    let apprvTxtColor;
    switch (leave?.Approve) {
      case 1:
        approve = "Approved";
        apprvTxtColor = "fw-semibold text-success";
        break;
      case 2:
        approve = "Declined";
        apprvTxtColor = "fw-semibold text-danger";
        break;
      case 3:
        approve = "Cancelled";
        apprvTxtColor = "fw-semibold text-warning";
        break;

      default:
        approve = "Pending";
        apprvTxtColor = "fw-semibold text-primary";
        break;
    }
    return (
      <tr>
        <td>{leave?.User}</td>
        <td>{leave?.DateOfFilling}</td>
        <td>{leave?.Lfrom}</td>
        <td>{leave?.Lto}</td>
        <td>{leave?.NoOfDays}</td>
        <td>{leave?.Ltype}</td>
        <td className={apprvTxtColor}>{approve}</td>
      </tr>
    );
  } else return null;
};

const memoizedLeave = memo(Leave);

export default memoizedLeave;
