import React, { useState, useEffect } from "react";
import {
  useDeleteWorkinfoMutation,
  useUpdateWorkinfoMutation,
} from "./recordsApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useRecordForm from "../../hooks/useRecordForm";
import WorkInfoModal from "../../modals/WorkInfoModal";
import { generateEmailMsg } from "../emailSender/generateEmailMsg";

const WorkInfo = ({
  workinfo,
  branch,
  isOutletProcessor,
  sendEmail,
  AssignedOutlet,
  employeeId,
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [validated, setValidated] = useState(false);

  const [showRegion, setShowRegion] = useState(false);
  const [showCountry, setShowCountry] = useState(false);

  // eslint-disable-next-line
  const [updateWorkinfo, { isLoading, isSuccess, isError, error }] =
    useUpdateWorkinfoMutation();

  const [
    deleteWorkinfo,
    // eslint-disable-next-line
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteWorkinfoMutation();

  /* VARIABLES */
  const { workState, workDispatch } = useRecordForm({ workinfo });

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    let workInfoData = workState;

    if (form.checkValidity() && !isLoading) {
      await updateWorkinfo(workInfoData);

      if (isOutletProcessor || AssignedOutlet !== "Head Office") {
        // await sendEmail(
        //   generateEmailMsg({
        //     branch,
        //     filename: `${employeeId}-WorkInfo.json`,
        //     id: workinfo?.id,
        //     compiledInfo: workInfoData,
        //     update: true,
        //     assignedOutlet: AssignedOutlet,
        //   })
        // );
      }
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  /* DELETE FUNCTION */
  const onDeleteWorkInfoClicked = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm(`Proceed deletion of this info?`);
    if (isConfirmed) {
      await deleteWorkinfo({ id: workState.id });
    } else {
      console.log("Deletion cancelled");
    }
  };

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setShowModal(false);
      setValidated(false);

      isSuccess && toast.info("Employment history updated!");
      isDelSuccess && toast.info("Employment history deleted!");

      window.location.reload();
    }
  }, [isSuccess, isDelSuccess, navigate]);

  if (workinfo) {
    return (
      <>
        <tr
          onClick={() => {
            setShowModal(true);
          }}
        >
          <td className={workState.ToPresent === 1 ? "bg-success-subtle" : ""}>
            {workState.Position_Title}
          </td>
          <td className={workState.ToPresent === 1 ? "bg-success-subtle" : ""}>
            {workState.Company_Name}
          </td>
          <td
            className={workState.ToPresent === 1 ? "bg-success-subtle" : ""}
          >{`${workState.State}, ${workState.Country}`}</td>
          <td
            className={workState.ToPresent === 1 ? "bg-success-subtle" : ""}
          >{`${workState.JoinedFR_M} ${workState.JoinedFR_Y}`}</td>
          <td
            className={workState.ToPresent === 1 ? "bg-success-subtle" : ""}
          >{`${workState.JoinedTO_M} ${
            workState.JoinedTO_Y === 0 ? "" : workState.JoinedTO_Y
          }`}</td>
        </tr>

        {/* View edit work info modal */}
        <WorkInfoModal
          workState={workState}
          workDispatch={workDispatch}
          showModal={showModal}
          setShowModal={setShowModal}
          validated={validated}
          onSaveInfoClicked={onSaveInfoClicked}
          onDeleteWorkInfoClicked={onDeleteWorkInfoClicked}
          showRegion={showRegion}
          setShowRegion={setShowRegion}
          showCountry={showCountry}
          setShowCountry={setShowCountry}
        />
      </>
    );
  }
};

export default WorkInfo;
