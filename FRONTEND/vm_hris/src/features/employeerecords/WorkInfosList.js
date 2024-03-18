import React, { useState, useEffect } from "react";
import WorkInfo from "./WorkInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button, Col, Row, Container, Table } from "react-bootstrap";
import { useAddWorkinfoMutation } from "./recordsApiSlice";
import { toast } from "react-toastify";
import { useSendEmailMutation } from "../emailSender/sendEmailApiSlice";
import { generateEmailMsg } from "../emailSender/generateEmailMsg";
import useAuth from "../../hooks/useAuth";
import useRecordForm from "../../hooks/useRecordForm";
import WorkInfoModal from "../../modals/WorkInfoModal";

const WorkInfosList = ({ workinfos, employeeId }) => {
  const { isOutletProcessor, branch } = useAuth();

  const [sendEmail] = useSendEmailMutation();

  const [showModal, setShowModal] = useState(false);

  const [validated, setValidated] = useState(false);

  const [showRegion, setShowRegion] = useState(false);
  const [showCountry, setShowCountry] = useState(false);

  // eslint-disable-next-line
  const [addWorkinfo, { isLoading, isSuccess, isError, error }] =
    useAddWorkinfoMutation();

  /* VARIABLES */
  const { workState, workDispatch } = useRecordForm({});

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    let workInfoData = {
      EmployeeID: employeeId,
      ...workState,
    };

    if (form.checkValidity() && !isLoading) {
      await addWorkinfo(workInfoData);

      if (isOutletProcessor) {
        await sendEmail(
          generateEmailMsg(
            branch,
            `${employeeId}-WorkInfo.json`,
            "",
            workInfoData
          )
        );
      }
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  useEffect(() => {
    if (isSuccess) {
      setShowModal(false);
      setValidated(false);
      toast.success("Employment history added!");

      window.location.reload();
    }
  }, [isSuccess]);

  const tableContent = workinfos?.length
    ? workinfos
        .sort((a, b) => {
          return b.JoinedFR_Y - a.JoinedFR_Y;
        })
        .map((work, index) => (
          <WorkInfo
            key={index}
            workinfo={work}
            branch={branch}
            isOutletProcessor={isOutletProcessor}
            sendEmail={sendEmail}
            generateEmailMsg={generateEmailMsg}
          />
        ))
    : null;

  return (
    <>
      <Container>
        <Row>
          <Col>
            <small>{`(Click any work history to edit. Present work is highlighted in GREEN)`}</small>
          </Col>
          <Col>
            <Button
              className="float-end"
              type="button"
              variant="outline-primary"
              onClick={() => setShowModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Col>
        </Row>
        <Table bordered striped hover className="align-middle ms-3 mt-3 mb-3">
          <thead>
            <tr>
              <th scope="col">Job Title</th>
              <th scope="col">Company Name</th>
              <th scope="col">Address</th>
              <th scope="col">Start</th>
              <th scope="col">End</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </Table>
      </Container>

      {/* View add dependent modal */}
      <WorkInfoModal
        workState={workState}
        workDispatch={workDispatch}
        showModal={showModal}
        setShowModal={setShowModal}
        validated={validated}
        onSaveInfoClicked={onSaveInfoClicked}
        showRegion={showRegion}
        setShowRegion={setShowRegion}
        showCountry={showCountry}
        setShowCountry={setShowCountry}
      />
    </>
  );
};

export default WorkInfosList;
