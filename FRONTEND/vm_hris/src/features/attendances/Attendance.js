//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
//import { useNavigate } from "react-router-dom";

import React, { memo, useState } from "react";
import { format } from "date-fns";
//import { Button } from "react-bootstrap";

//import useAuth from "../../hooks/useAuth";

const Attendance = ({ att, attlogData }) => {
  const [matchingAtt, setMatchingAtt] = useState([]);

  const handleShowModal = () => {
    const tempAttData = [];

    try {
      attlogData
        .filter((line) => {
          const [bioId, datetime, val1, val2, val3, val4] = line.split("\t"); // eslint-disable-line no-unused-vars

          return String(bioId) === String(att.bioId);
        })
        .forEach((line) => {
          const [bioId, datetime, val1, val2, val3, val4] = line.split("\t"); // eslint-disable-line no-unused-vars

          const formattedDate = format(new Date(datetime), "P");
          const formattedTime = format(new Date(datetime), "p");

          const existingLine = tempAttData.findIndex((e) => {
            return e.bioId === bioId && e.date === formattedDate;
          });

          if (existingLine !== -1) {
            if (val2 * 1 === 0) {
              tempAttData[existingLine] = {
                ...tempAttData[existingLine],
                checkIn: formattedTime,
              };
            } else if (val2 * 1 === 1) {
              tempAttData[existingLine] = {
                ...tempAttData[existingLine],
                checkOut: formattedTime,
              };
            } else if (val2 * 1 === 2) {
              tempAttData[existingLine] = {
                ...tempAttData[existingLine],
                breakIn: formattedTime,
              };
            } else if (val2 * 1 === 3) {
              tempAttData[existingLine] = {
                ...tempAttData[existingLine],
                breakOut: formattedTime,
              };
            }
          } else {
            tempAttData.push({
              bioId: bioId,
              date: formattedDate,
              checkIn: val2 * 1 === 0 ? formattedTime : "",
              checkOut: val2 * 1 === 1 ? formattedTime : "",
              breakIn: val2 * 1 === 2 ? formattedTime : "",
              breakOut: val2 * 1 === 3 ? formattedTime : "",
            });
          }
        });
    } catch (error) {
      console.error(`handleShowModal Error: ${error}`);
    }
    setMatchingAtt(tempAttData);
    console.log(tempAttData);
  };

  if (att) {
    return (
      <tr key={att.bioId} onClick={handleShowModal}>
        <td>{att.bioId}</td>
        <td>{att.name}</td>
        {/* <td>{att.date}</td>
        <td>{att.checkIn}</td>
        <td>{att.breakIn}</td>
        <td>{att.breakOut}</td>
        <td>{att.checkOut}</td> */}
      </tr>
    );
  } else return null;
};

const memoizedAttendance = memo(Attendance);

export default memoizedAttendance;
