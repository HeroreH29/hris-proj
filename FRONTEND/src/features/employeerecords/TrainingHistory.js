import React from "react";

const TrainingHistory = ({
  trainingHistory = {},
  handleEditTrainingHistory = undefined,
}) => {
  return (
    <>
      <tr onClick={() => handleEditTrainingHistory(trainingHistory)}>
        <td>{trainingHistory.TrainingCourse}</td>
        <td>{trainingHistory.TrainingDate}</td>
        <td>{trainingHistory.Remarks}</td>
      </tr>
    </>
  );
};

export default TrainingHistory;
