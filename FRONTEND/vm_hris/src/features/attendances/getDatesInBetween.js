import React from "react";

const getDatesInBetween = (date1, date2) => {
  // Generation of dates for attendance printing

  const dateFrom = new Date(date1);
  const dateTo = new Date(date2);

  const dates = [];
  let currentDate = new Date(dateFrom);

  while (currentDate <= dateTo) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export default getDatesInBetween;
