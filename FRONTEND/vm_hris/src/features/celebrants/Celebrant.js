import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectPersonalinfoById } from "./celebrantsApiSlice";

import React from "react";
import { Button } from "react-bootstrap";

const Celebrant = ({ personalInfoId }) => {
  const personalinfo = useSelector((state) =>
    selectPersonalinfoById(state, personalInfoId)
  );

  const navigate = useNavigate();

  if (personalinfo) {
    const handleEdit = () =>
      navigate(`/dashboard/celebrants/${personalInfoId}`);

    return (
      <tr>
        <td>{personalinfo.EmployeeID}</td>
        <td>{personalinfo.Birthday}</td>
      </tr>
    );
  } else return null;
};

export default Celebrant;
