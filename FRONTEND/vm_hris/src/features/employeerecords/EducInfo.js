import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Col, Row, InputGroup } from "react-bootstrap";
import {
  useDeleteEducinfoMutation,
  useUpdateEducinfoMutation,
} from "./recordsApiSlice";
import { LEVEL, DEGREE } from "../../config/educOptions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EducInfo = ({ educinfo }) => {
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
  const [educInfoJson, setEducInfoJson] = useState({
    Institution_Name: educinfo?.Institution_Name,
    Address: educinfo?.Address,
    Level: educinfo?.Level,
    Degree: educinfo?.Degree,
    yrStart: educinfo?.yrStart,
    yrGraduated: educinfo?.yrGraduated,
    Field_of_Study: educinfo?.Field_of_Study,
    Major: educinfo?.Major,
    id: educinfo?.id,
  });

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() && !isLoading) {
      await updateEducinfo(educInfoJson);
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
      await deleteEducinfo(educInfoJson);
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

      navigate(`/employeerecords/${educinfo?.EmployeeID}`);
    }
  }, [isSuccess, navigate, educinfo?.EmployeeID, isDelSuccess]);

  if (educinfo) {
    return (
      <>
        <tr
          onClick={() => {
            setShowModal(true);
          }}
        >
          <td>{educInfoJson.Institution_Name}</td>
          <td>{educInfoJson.Address}</td>
          <td>{`${educInfoJson.Field_of_Study} | ${educInfoJson.Degree} | ${educInfoJson.Major} (${educInfoJson.Level})`}</td>
          <td>{`${educInfoJson.yrStart} - ${educInfoJson.yrGraduated}`}</td>
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
                    value={educInfoJson.Institution_Name}
                    onChange={(e) =>
                      setEducInfoJson((prev) => ({
                        ...prev,
                        Institution_Name: e.target.value,
                      }))
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
                    value={educInfoJson.Address}
                    onChange={(e) =>
                      setEducInfoJson((prev) => ({
                        ...prev,
                        Address: e.target.value,
                      }))
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              {/* Course, Degree, and Strand */}
              <Row className="mb-3">
                <Form.Group as={Col} md="auto" className="mb-3">
                  <Form.Label className="fw-semibold">
                    {`Course (Field) | Degree | Strand (Major) & Level`}
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Enter Course (Field)"
                      value={educInfoJson.Field_of_Study}
                      onChange={(e) =>
                        setEducInfoJson((prev) => ({
                          ...prev,
                          Field_of_Study: e.target.value,
                        }))
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      This field is required!
                    </Form.Control.Feedback>
                    <Form.Select
                      value={educInfoJson.Degree}
                      onChange={(e) =>
                        setEducInfoJson((prev) => ({
                          ...prev,
                          Degree: e.target.value,
                        }))
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
                      value={educInfoJson.Major}
                      onChange={(e) =>
                        setEducInfoJson((prev) => ({
                          ...prev,
                          Major: e.target.value,
                        }))
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      This field is required!
                    </Form.Control.Feedback>
                    <Form.Select
                      value={educInfoJson.Level}
                      onChange={(e) =>
                        setEducInfoJson((prev) => ({
                          ...prev,
                          Level: e.target.value,
                        }))
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
                      value={educInfoJson.yrStart}
                      onChange={(e) =>
                        setEducInfoJson((prev) => ({
                          ...prev,
                          yrStart: e.target.value,
                        }))
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      This field is required!
                    </Form.Control.Feedback>
                    <Form.Control
                      type="number"
                      placeholder="Year Graduated"
                      value={educInfoJson.yrGraduated}
                      onChange={(e) =>
                        setEducInfoJson((prev) => ({
                          ...prev,
                          yrGraduated: e.target.value,
                        }))
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      This field is required!
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
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
