import React from "react";
import { format } from "date-fns";

const Celebrant = ({ birthday, name }) => {
  const currentDay = new Date().getDate();

  const checkCurrentCelebrant = () => {
    const celebrantDay = new Date(birthday).getDate();

    if (currentDay === celebrantDay) {
      return "fw-bold table-success text-danger";
    } else {
      return "fst-normal";
    }
  };

  if (birthday) {
    return (
      <tr>
        <td className={checkCurrentCelebrant()}>{name}</td>
        <td className={checkCurrentCelebrant()}>
          {format(new Date([birthday]), "MMMM dd")}
        </td>
      </tr>
    );
  } else return null;
};

export default Celebrant;
