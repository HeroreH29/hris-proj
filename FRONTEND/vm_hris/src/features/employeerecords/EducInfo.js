import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Col, Row, InputGroup } from "react-bootstrap";
import {
  useDeleteEducinfoMutation,
  useUpdateEducinfoMutation,
} from "./recordsApiSlice";
import { LEVEL, DEGREE } from "../../config/educOptions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useRecordForm from "../../hooks/useRecordForm";
import { generateEmailMsg } from "../emailSender/generateEmailMsg";

const EducInfo = ({
  educinfo,
  branch,
  isOutletProcessor,
  sendEmail,
  AssignedOutlet,
  employeeId,
}) => {
  const navigate = useNavigate();
  const formRef = useRef();

  const [showModal, setShowModal] = useState(false);

  const [validated, setValidated] = useState(false);

  // eslint-disable-next-line
  const [updateEducinfo, { isLoading, isSuccess, isError, error }] =
    useUpdateEducinfoMutation();

  const [
    deleteEducinfo,
    // eslint-disable-next-line
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteEducinfoMutation();

  /* VARIABLES */
  const { educState, educDispatch } = useRecordForm({ educinfo });

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const { __v, _id, ...others } = educState;

    const form = e.currentTarget;

    if (form.checkValidity() && !isLoading) {
      await updateEducinfo(others);

      if (isOutletProcessor || AssignedOutlet !== "Head Office") {
        await sendEmail(
          generateEmailMsg({
            branch,
            filename: `${employeeId}-EducInfo.json`,
            id: educinfo?.id,
            compiledInfo: others,
            update: true,
            assignedOutlet: AssignedOutlet,
          })
        );
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
      await deleteEducinfo(educState);
    } else {
      console.log("Deletion cancelled");
    }
  };

  /* DROPDOWN OPTIONS */
  const levelOptions = Object.entries(LEVEL).map(([key, value]) => {
    return (
      <option value={value} key={key}>
        {key}
      </option>
    );
  });
  const degreeOptions = Object.entries(DEGREE).map(([key, value]) => {
    return (
      <option value={value} key={key}>
        {key}
      </option>
    );
  });

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setShowModal(false);
      setValidated(false);

      isSuccess && toast.info("Educational attainment updated!");
      isDelSuccess && toast.info("Educational attainment deleted!");

      //navigate(`/employeerecords/${educState.EmployeeID}`);
      window.location.reload();
    }
  }, [isSuccess, navigate, educState.EmployeeID, isDelSuccess]);

  if (educinfo) {
    return (
      <>
        <tr
          onClick={() => {
            setShowModal(true);
          }}
        >
          <td>{educState.Institution_Name}</td>
          <td>{educState.Address}</td>
          <td>{`${educState.Field_of_Study} | ${educState.Degree} | ${educState.Major} (${educState.Level})`}</td>
          <td>{`${educState.yrStart} - ${educState.yrGraduated}`}</td>
        </tr>

        {/* View edit educ info modal */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Educational Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              className="p-3"
              noValidate
              validated={validated}
              onSubmit={onSaveInfoClicked}
              ref={formRef}
            >
              {/* Institution Name and Address */}
              <Row className="mb-3">
                <Form.Group as={Col} className="mb-3">
                  <Form.Label className="fw-semibold">
                    Institution Name
                  </Form.Label>
                  <Form.Control
                    required
                    autoFocus
                    autoComplete="off"
                    type="text"
                    value={educState.Institution_Name}
                    onChange={(e) =>
                      educDispatch({
                        type: "institution_name",
                        Institution_Name: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="mb-3">
                  <Form.Label className="fw-semibold">Address</Form.Label>
                  <Form.Control
                    required
                    autoComplete="off"
                    type="text"
                    value={educState.Address}
                    onChange={(e) =>
                      educDispatch({
                        type: "address",
                        Address: e.target.value,
                      })
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              {/* Course, Degree, Strand, and Level*/}
              <Row className="mb-3">
                <Form.Group as={Col} md="auto" className="mb-3">
                  <Form.Label className="fw-semibold">
                    {`Course (Field) | Degree | Strand (Major) & Level`}
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Enter Course (Field)"
                      value={educState.Field_of_Study}
                      onChange={(e) =>
                        educDispatch({
                          type: "field_of_study",
                          Field_of_Study: e.target.value,
                        })
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      This field is required!
                    </Form.Control.Feedback>
                    <Form.Select
                      value={educState.Degree}
                      onChange={(e) =>
                        educDispatch({
                          type: "degree",
                          Degree: e.target.value,
                        })
                      }
                    >
                      {degreeOptions}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      This field is required!
                    </Form.Control.Feedback>
                    <Form.Control
                      type="text"
                      placeholder="Enter Strand (Major)"
                      value={educState.Major}
                      onChange={(e) =>
                        educDispatch({
                          type: "major",
                          Major: e.target.value,
                        })
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      This field is required!
                    </Form.Control.Feedback>
                    <Form.Select
                      value={educState.Level}
                      onChange={(e) =>
                        educDispatch({
                          type: "level",
                          Level: e.target.value,
                        })
                      }
                    >
                      {levelOptions}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Row>
              {/* Year Attended (Started - Graduated) */}
              <Row className="mb-3">
                <Form.Group as={Col} md="auto" className="mb-3">
                  <Form.Label className="fw-semibold">Year Attended</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      placeholder="Year Started"
                      value={educState.yrStart}
                      onChange={(e) =>
                        educDispatch({
                          type: "yr_start",
                          yrStart: e.target.value,
                        })
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      This field is required!
                    </Form.Control.Feedback>
                    <Form.Control
                      type="number"
                      placeholder="Year Graduated"
                      value={educState.yrGraduated}
                      onChange={(e) =>
                        educDispatch({
                          type: "yr_graduated",
                          yrGraduated: e.target.value,
                        })
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      This field is required!
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
              {/* Save and Delete buttons */}
              <Row className="mb-3 float-end">
                <Col>
                  <Button
                    type="submit"
                    variant="outline-success"
                    className="me-3"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={onDeleteWorkInfoClicked}
                    type="button"
                    disabled
                    variant="outline-danger"
                  >
                    Delete Info
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
};

export default EducInfo;
