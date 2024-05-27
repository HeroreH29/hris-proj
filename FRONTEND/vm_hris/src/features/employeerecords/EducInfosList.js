import React, { useState, useEffect } from "react";
import EducInfo from "./EducInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Modal,
  Form,
  Col,
  Row,
  InputGroup,
  Container,
  Table,
} from "react-bootstrap";
import { useAddEducinfoMutation } from "./recordsApiSlice";
import { LEVEL, DEGREE } from "../../config/educOptions";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useSendEmailMutation } from "../emailSender/sendEmailApiSlice";
import { generateEmailMsg } from "../emailSender/generateEmailMsg";
import useRecordForm from "../../hooks/useRecordForm";

const EducInfoList = ({ educinfos, employeeId, AssignedOutlet }) => {
  const { branch, isX } = useAuth();

  const [showModal, setShowModal] = useState(false);

  const [validated, setValidated] = useState(false);

  // eslint-disable-next-line
  const [addEducinfo, { isLoading, isSuccess, isError, error }] =
    useAddEducinfoMutation();

  const [sendEmail] = useSendEmailMutation();

  /* VARIABLES */
  const { educState, educDispatch } = useRecordForm({});

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    const { __v, _id, ...others } = educState;

    let educInfoData = {
      ...others,
      EmployeeID: employeeId,
    };

    if (form.checkValidity() && !isLoading) {
      await addEducinfo(educInfoData);

      // if (isOutletProcessor || AssignedOutlet !== "Head Office") {
      //   const updateRecord = isOutletProcessor && payload;
      //   const id = updateRecord ? geninfo?.id : "";
      //   await sendEmail(
      //     generateEmailMsg({
      //       branch,
      //       filename: `${employeeId}-EducInfo.json`,
      //       educInfoData,
      //       assignedOutlet: AssignedOutlet,
      //     })
      //   );
      // }
    } else {
      e.stopPropagation();
    }

    setValidated(true);
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
    if (isSuccess) {
      setShowModal(false);
      setValidated(false);
      toast.success("Educational information added!");

      window.location.reload();
    }
  }, [isSuccess]);

  const tableContent = educinfos?.length
    ? educinfos
        .sort((a, b) => {
          return b.yrStart - a.yrStart;
        })
        .map((educ, index) => (
          <EducInfo
            key={index}
            educinfo={educ}
            branch={branch}
            sendEmail={sendEmail}
            AssignedOutlet={AssignedOutlet}
            employeeId={employeeId}
          />
        ))
    : null;

  return (
    <>
      <Container>
        <Row>
          {!isX.isOutletProcessor && (
            <>
              <Col>
                <small>{`(Click any educational attainment to edit)`}</small>
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
            </>
          )}
        </Row>
        <Table bordered striped hover className="align-middle ms-3 mt-3 mb-3">
          <thead>
            <tr>
              <th scope="col">Institution Name</th>
              <th scope="col">Address</th>
              <th scope="col">{`Course | Degree | Strand (Level)`}</th>
              <th scope="col">Year Attended</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </Table>
      </Container>

      {/* View add educ info modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Educational Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            className="p-3"
            noValidate
            validated={validated}
            onSubmit={onSaveInfoClicked}
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
                    type="text"
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
                    type="text"
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
            <Row className="mb-3 float-end">
              <Col>
                <Button type="submit" variant="outline-success">
                  Add New Info
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EducInfoList;
