import React, { useState, useEffect, useRef } from "react";
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
  Dropdown,
  DropdownButton,
  Container,
  Table,
} from "react-bootstrap";
import { useAddEducinfoMutation } from "./recordsApiSlice";
import { LEVEL, DEGREE } from "../../config/educOptions";

const EducInfoList = ({ educinfos, employeeId }) => {
  const formRef = useRef();

  const [showModal, setShowModal] = useState(false);

  const [validated, setValidated] = useState(false);

  const [addEducinfo, { isLoading, isSuccess, isError, error }] =
    useAddEducinfoMutation();

  /* VARIABLES */
  const [educInfoJson, setEducInfoJson] = useState({
    Institution_Name: "",
    Address: "",
    Level: "",
    Degree: "",
    yrStart: "",
    yrGraduated: "",
    Field_of_Study: "",
    Major: "",
    EmployeeID: employeeId,
  });

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() && !isLoading) {
      await addEducinfo(educInfoJson);
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
      formRef.current.reset();
      setShowModal(false);
      setValidated(false);
    }
  }, [isSuccess]);

  const tableContent = educinfos?.length
    ? educinfos.map((educ, index) => <EducInfo key={index} educinfo={educ} />)
    : null;

  return (
    <>
      <Container>
        <Row>
          <Col>
            <small>{`(Click any work history to edit)`}</small>
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
        <Table
          responsive
          bordered
          striped
          hover
          className="align-middle ms-3 mt-3 mb-3"
        >
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
