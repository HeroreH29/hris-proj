import React, { useState, useEffect } from "react";
import WorkInfo from "./WorkInfo";
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
import { useAddWorkinfoMutation } from "./recordsApiSlice";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { toast } from "react-toastify";
import { useSendEmailMutation } from "../emailSender/sendEmailApiSlice";
import { generateEmailMsg } from "../emailSender/generateEmailMsg";
import useAuth from "../../hooks/useAuth";

const WorkInfosList = ({ workinfos, employeeId }) => {
  const { isOutletProcessor, branch } = useAuth();

  const [works, setWorks] = useState([]);

  const [sendEmail] = useSendEmailMutation();

  useEffect(() => {
    setWorks(workinfos);
    // eslint-disable-next-line
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [validated, setValidated] = useState(false);

  const [showRegion, setShowRegion] = useState(false);
  const [showCountry, setShowCountry] = useState(false);

  // eslint-disable-next-line
  const [addWorkinfo, { isLoading, isSuccess, isError, error }] =
    useAddWorkinfoMutation();

  /* VARIABLES */
  const [positionTitle, setPositionTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [joinedFRM, setJoinedFRM] = useState("");
  const [joinedFRY, setJoinedFRY] = useState(0);
  const [joinedTOM, setJoinedTOM] = useState("");
  const [joinedTOY, setJoinedTOY] = useState(0);
  const [specialization, setSpecialization] = useState("");
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState(""); // aka State
  const [industry, setIndustry] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [toPresent, setToPresent] = useState(0);

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    let workInfoData = {
      EmployeeID: employeeId,
      Position_Title: positionTitle,
      Company_Name: companyName,
      JoinedFR_M: joinedFRM,
      JoinedFR_Y: joinedFRY,
      JoinedTO_M: joinedTOM,
      JoinedTO_Y: joinedTOY,
      Specialization: specialization,
      Role: role,
      Country: country,
      State: region,
      Industry: industry,
      Position: position,
      Salary: salary,
      Work_Description: workDesc,
      ToPresent: toPresent,
    };

    if (form.checkValidity() && !isLoading) {
      await addWorkinfo(workInfoData);

      setWorks((prev) => [...prev, workInfoData]);

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
      setPositionTitle("");
      setCompanyName("");
      setJoinedFRM("");
      setJoinedFRY(0);
      setJoinedTOM("");
      setJoinedTOY(0);
      setSpecialization("");
      setRole("");
      setCountry("");
      setRegion(""); // aka State
      setIndustry("");
      setPosition("");
      setSalary("");
      setWorkDesc("");
      setToPresent(0);
      setShowModal(false);
      setValidated(false);
      toast.success("Employment history added!");

      //window.location.reload();
    }
  }, [isSuccess]);

  const tableContent = works?.length
    ? works
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
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Work Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            className="p-3"
            noValidate
            validated={validated}
            onSubmit={onSaveInfoClicked}
          >
            {/* Job Title, Company Name, and Company Address */}
            <Row className="mb-3">
              <Form.Group as={Col} md="auto" className="mb-3">
                <Form.Label className="fw-semibold">Job Title</Form.Label>
                <Form.Control
                  required
                  autoFocus
                  autoComplete="off"
                  type="text"
                  value={positionTitle}
                  onChange={(e) => setPositionTitle(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="auto" className="mb-3">
                <Form.Label className="fw-semibold">Company Name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="auto" className="mb-3">
                <Form.Label className="fw-semibold">Address</Form.Label>
                <InputGroup>
                  {showCountry ? (
                    <CountryDropdown
                      classes="form-select"
                      value={country}
                      onChange={(e) => setCountry(e)}
                    />
                  ) : (
                    <Form.Control
                      type="text"
                      placeholder="Enter Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  )}
                  <DropdownButton title="" variant="outline-secondary">
                    <Dropdown.Item
                      as={"option"}
                      onClick={() => setShowCountry(false)}
                    >
                      Enter Country
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={"option"}
                      onClick={() => setShowCountry(true)}
                    >
                      Select Country
                    </Dropdown.Item>
                  </DropdownButton>
                  {showRegion ? (
                    <RegionDropdown
                      classes="dropdown-toggle show form-select"
                      defaultOptionLabel="Select State"
                      country={country}
                      value={region}
                      onChange={(e) => setRegion(e)}
                    />
                  ) : (
                    <Form.Control
                      type="text"
                      placeholder="Enter State"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    />
                  )}
                  <DropdownButton title="" variant="outline-secondary">
                    <Dropdown.Item
                      as={"option"}
                      onClick={() => setShowRegion(false)}
                    >
                      Enter State
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={"option"}
                      onClick={() => setShowRegion(true)}
                    >
                      Select State
                    </Dropdown.Item>
                  </DropdownButton>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            {/* Start, End Work, and Present Job */}
            <Row className="mb-3">
              <Form.Group as={Col} md="auto" className="mb-3">
                <Form.Label className="fw-semibold">
                  Job Start Month | Year
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    required
                    type="text"
                    value={joinedFRM}
                    onChange={(e) => setJoinedFRM(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                  <Form.Control
                    required
                    type="number"
                    value={joinedFRY}
                    onChange={(e) => setJoinedFRY(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="auto" className="mb-3">
                <Form.Label className="fw-semibold">
                  Job End Month | Year
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    disabled={toPresent === 1}
                    type="text"
                    required={toPresent !== 1}
                    value={joinedTOM}
                    onChange={(e) => setJoinedTOM(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>

                  <Form.Control
                    disabled={toPresent === 1}
                    required={toPresent !== 1}
                    type="number"
                    value={joinedTOY}
                    onChange={(e) => setJoinedTOY(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Present Job"
                  checked={toPresent === 1 ? true : false}
                  onChange={(e) => setToPresent(e.target.checked ? 1 : 0)}
                />
              </Form.Group>
            </Row>
            {/* Specialization, Role, Industry, Position Level */}
            <Row className="mb-3">
              <Form.Group as={Col} md="auto" className="mb-3">
                <Form.Label className="fw-semibold">Specialization</Form.Label>
                <Form.Control
                  required
                  autoComplete="off"
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="auto" className="mb-3">
                <Form.Label className="fw-semibold">Role</Form.Label>
                <Form.Control
                  required
                  autoComplete="off"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="auto" className="mb-3">
                <Form.Label className="fw-semibold">Industry</Form.Label>
                <Form.Control
                  required
                  autoComplete="off"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="auto" className="mb-3">
                <Form.Label className="fw-semibold">Position Level</Form.Label>
                <Form.Control
                  required
                  autoComplete="off"
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            {/* Salary and Work Description */}
            <Row className="mb-3">
              <Form.Group as={Col} md="auto" className="mb-3">
                <Form.Label className="fw-semibold">Salary</Form.Label>
                <Form.Control
                  autoComplete="off"
                  type="text"
                  value={salary}
                  placeholder="(Optional)"
                  onChange={(e) => setSalary(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="auto" className="mb-3">
                <Form.Label className="fw-semibold">
                  Work Description
                </Form.Label>
                <Form.Control
                  required
                  autoComplete="off"
                  as="textarea"
                  value={workDesc}
                  onChange={(e) => setWorkDesc(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="justify-content-end">
              <Col md="auto">
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

export default WorkInfosList;
