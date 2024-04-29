import React from "react";

const TrainingHistory = ({ trainingHistory = {} }) => {
  return (
    <>
      <tr
      //   onClick={() => {
      //     setShowModal(true);
      //   }}
      >
        <td>{trainingHistory.TrainingCourse}</td>
        <td>{trainingHistory.TrainingDate}</td>
        <td>{trainingHistory.Remarks}</td>
      </tr>
    </>
  );
};

export default TrainingHistory;
