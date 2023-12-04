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
  const currentDay = new Date().getDate();

  const checkCurrentCelebrant = () => {
    const celebrantDay = new Date(personalinfo.Birthday).getDate();

    if (currentDay === celebrantDay) {
      return "fw-semibold";
    } else {
      return "fst-normal";
    }
  };

  if (personalinfo) {
    const handleEdit = () =>
      navigate(`/dashboard/celebrants/${personalInfoId}`);

    return (
      <tr>
        <td className={checkCurrentCelebrant()}>{name}</td>
        <td className={checkCurrentCelebrant()}>{personalinfo.Birthday}</td>
      </tr>
    );
  } else return null;
};

export default Celebrant;
