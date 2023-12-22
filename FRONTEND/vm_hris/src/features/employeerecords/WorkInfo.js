import React, { useState, useEffect } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import {
  Button,
  Modal,
  Form,
  Col,
  Row,
  InputGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import {
  useDeleteWorkinfoMutation,
  useUpdateWorkinfoMutation,
} from "./recordsApiSlice";

const WorkInfo = ({ workinfo }) => {
  const [showModal, setShowModal] = useState(false);

  const [validated, setValidated] = useState(false);

  const [showRegion, setShowRegion] = useState(false);
  const [showCountry, setShowCountry] = useState(false);

  const [updateWorkinfo, { isLoading, isSuccess, isError, error }] =
    useUpdateWorkinfoMutation();

  const [
    deleteWorkinfo,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteWorkinfoMutation();

  /* VARIABLES */
  const [positionTitle, setPositionTitle] = useState(workinfo?.Position_Title);
  const [companyName, setCompanyName] = useState(workinfo?.Company_Name);
  const [joinedFRM, setJoinedFRM] = useState(workinfo?.JoinedFR_M);
  const [joinedFRY, setJoinedFRY] = useState(workinfo?.JoinedFR_Y);
  const [joinedTOM, setJoinedTOM] = useState(workinfo?.JoinedTO_M);
  const [joinedTOY, setJoinedTOY] = useState(workinfo?.JoinedTO_Y);
  const [specialization, setSpecialization] = useState(
    workinfo?.Specialization
  );
  const [role, setRole] = useState(workinfo?.Role);
  const [country, setCountry] = useState(workinfo?.Country);
  const [region, setRegion] = useState(workinfo?.State); // aka State
  const [industry, setIndustry] = useState(workinfo?.Industry);
  const [position, setPosition] = useState(workinfo?.Position);
  const [salary, setSalary] = useState(workinfo?.Salary);
  const [workDesc, setWorkDesc] = useState(workinfo?.Work_Description);
  const [toPresent, setToPresent] = useState(workinfo?.ToPresent);

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() && !isLoading) {
      await updateWorkinfo({
        id: workinfo.id,
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
      });
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
      await deleteWorkinfo({ id: workinfo.id });
    } else {
      console.log("Deletion cancelled");
    }
  };

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setShowModal(false);
      setValidated(false);
    }
  }, [isSuccess, isDelSuccess]);

  if (workinfo) {
    return (
      <>
        <tr
          onClick={() => {
            setShowModal(true);
          }}
        >
          <td>{positionTitle}</td>
          <td>{companyName}</td>
          <td>{`${region}, ${country}`}</td>
          <td>{`${joinedFRM}, ${joinedFRY}`}</td>
          <td>{`${joinedTOM}, ${joinedTOY}`}</td>
        </tr>

        {/* View edit work info modal */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Work Info</Modal.Title>
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
                      type="text"
                      value={joinedTOM}
                      onChange={(e) => setJoinedTOM(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      This field is required!
                    </Form.Control.Feedback>

                    <Form.Control
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
                  <Form.Label className="fw-semibold">
                    Specialization
                  </Form.Label>
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
                  <Form.Label className="fw-semibold">
                    Position Level
                  </Form.Label>
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
              <Row className="mb-3 float-end">
                <Col md="auto">
                  <Button type="submit" variant="outline-success">
                    Save Changes
                  </Button>
                </Col>
                <Col md="auto">
                  {/* Enable if dependent deletion is required */}
                  <Button
                    disabled
                    type="button"
                    onClick={onDeleteWorkInfoClicked}
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

export default WorkInfo;
