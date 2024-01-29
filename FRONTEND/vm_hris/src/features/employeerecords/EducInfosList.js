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

const EducInfoList = ({ educinfos, employeeId }) => {
  const [educs, setEducs] = useState([]);

  useEffect(() => {
    setEducs(educinfos);
    // eslint-disable-next-line
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [validated, setValidated] = useState(false);

  // eslint-disable-next-line
  const [addEducinfo, { isLoading, isSuccess, isError, error }] =
    useAddEducinfoMutation();

  /* VARIABLES */
  const [institutionName, setInstitutionName] = useState("");
  const [address, setAddress] = useState("");
  const [level, setLevel] = useState("");
  const [degree, setDegree] = useState("");
  const [yrStart, setYrStart] = useState("");
  const [yrGraduated, setYrGraduated] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [major, setMajor] = useState("");
  const employeeID = employeeId;

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() && !isLoading) {
      await addEducinfo({
        Institution_Name: institutionName,
        Address: address,
        Degree: degree,
        Level: level,
        yrStart: yrStart,
        yrGraduated: yrGraduated,
        Field_of_Study: fieldOfStudy,
        Major: major,
        EmployeeID: employeeID,
      });

      setEducs((prev) => [
        ...prev,
        {
          Institution_Name: institutionName,
          Address: address,
          Degree: degree,
          Level: level,
          yrStart: yrStart,
          yrGraduated: yrGraduated,
          Field_of_Study: fieldOfStudy,
          Major: major,
          EmployeeID: employeeID,
        },
      ]);
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
      setInstitutionName("");
      setAddress("");
      setLevel("");
      setDegree("");
      setYrStart("");
      setYrGraduated("");
      setFieldOfStudy("");
      setMajor("");
      setShowModal(false);
      setValidated(false);
      toast.success("Educational information added!");

      //window.location.reload();
    }
  }, [isSuccess]);

  const tableContent = educs?.length
    ? educs
        .sort((a, b) => {
          return b.yrStart - a.yrStart;
        })
        .map((educ, index) => <EducInfo key={index} educinfo={educ} />)
    : null;

  return (
    <>
      <Container>
        <Row>
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
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
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
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
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
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                  <Form.Select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                  >
                    {degreeOptions}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                  <Form.Control
                    type="text"
                    placeholder="Enter Strand (Major)"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                  <Form.Select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
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
                    value={yrStart}
                    onChange={(e) => setYrStart(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                  <Form.Control
                    type="number"
                    placeholder="Year Graduated"
                    value={yrGraduated}
                    onChange={(e) => setYrGraduated(e.target.value)}
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
