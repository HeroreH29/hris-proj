import { useGetPersonalinfosQuery } from "./pCelebrantsApiSlice";

import React from "react";

const Celebrant = ({ personalInfoId, name }) => {
  const { personalinfo } = useGetPersonalinfosQuery("celebrantsList", {
    selectFromResult: ({ data }) => ({
      personalinfo: data?.entities[personalInfoId],
    }),
  });

  const currentDay = new Date().getDate();

  const checkCurrentCelebrant = () => {
    const celebrantDay = new Date(personalinfo.Birthday).getDate();

    if (currentDay === celebrantDay) {
      return "fw-bold table-success text-danger";
    } else {
      return "fst-normal";
    }
  };

  if (personalinfo) {
    // Uncomment line below if celebrant information editing is necessary
    /* const handleEdit = () =>
      navigate(`/dashboard/celebrants/${personalInfoId}`); */

    return (
      <tr>
        <td className={checkCurrentCelebrant()}>{name}</td>
        <td className={checkCurrentCelebrant()}>{personalinfo.Birthday}</td>
      </tr>
    );
  } else return null;
};

export default Celebrant;
