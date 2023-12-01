import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectPersonalinfoById } from "./celebrantsApiSlice";
import { selectGeninfoById } from "./celebrantsApiSlice";

import React from "react";
import { Button } from "react-bootstrap";

const Celebrant = ({ personalInfoId, name }) => {
  const personalinfo = useSelector((state) =>
    selectPersonalinfoById(state, personalInfoId)
  );

  const navigate = useNavigate();

  if (personalinfo) {
    const handleEdit = () =>
      navigate(`/dashboard/celebrants/${personalInfoId}`);

    return (
      <tr>
        <td>{name}</td>
        <td>{personalinfo.Birthday}</td>
      </tr>
    );
  } else return null;
};

export default Celebrant;
