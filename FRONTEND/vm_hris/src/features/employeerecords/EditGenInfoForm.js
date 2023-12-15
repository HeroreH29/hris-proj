import React, { useState, useEffect } from "react";
import { useUpdateGeninfoMutation } from "./recordsApiSlice";
import { useNavigate } from "react-router-dom";
import {
  ASSIGNEDOUTLET,
  DEPARTMENT,
  EMPLOYEETYPE,
  EMPSTATUS,
  PREFIX,
} from "../../config/gInfoOptions";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import { format, parse } from "date-fns";

const NUMBER_REGEX = "[0-9]";
const ALPHANUM_REGEX = "[A-z0-9]";

const EditGenInfoForm = ({ geninfo }) => {
  const [updateGeninfo, { isLoading, isSuccess, isError, error }] =
    useUpdateGeninfoMutation();

  const navigate = useNavigate();
  const parsedDE = parse(geninfo?.DateEmployed, "MMM dd, yyyy", new Date());
  const parsedRD = parse(geninfo?.RegDate, "MMMM dd, yyyy", new Date());
  const parsedDL = geninfo.DateLeaved
    ? parse(geninfo?.DateLeaved, "MMM dd, yyyy", new Date())
    : null;
  const parsedDP = geninfo.DateProbationary
    ? parse(geninfo?.DateProbationary, "MMM dd, yyyy", new Date())
    : null;

  /* GENINFO VARIABLES */
  const [bioId, setBioId] = useState(geninfo.BioID);
  const [prefix, setPrefix] = useState(geninfo.Prefix);
  const [firstName, setFirstName] = useState(geninfo.FirstName);
  const [middleName, setMiddleName] = useState(geninfo.MiddleName);
  const [lastName, setLastName] = useState(geninfo.LastName);
  const [employeeType, setEmployeeType] = useState(geninfo.EmployeeType);
  const [assignedOutlet, setAssignedOutlet] = useState(geninfo.AssignedOutlet);
  const [department, setDepartment] = useState(geninfo.Department);
  const [jobTitle, setJobTitle] = useState(geninfo.JobTitle);
  const [dateEmployed, setDateEmployed] = useState(
    format(parsedDE, "yyyy-MM-dd")
  );
  const [regDate, setRegDate] = useState(format(parsedRD, "yyyy-MM-dd"));
  const [dateLeaved, setDateLeaved] = useState(
    parsedDL ? format(parsedDL, "yyyy-MM-dd") : null
  );
  const [dateProbationary, setDateProbationary] = useState(
    parsedDP ? format(parsedDP, "yyyy-MM-dd") : null
  );
  const [empStatus, setEmpStatus] = useState(geninfo.EmpStatus);
  const [notes, setNotes] = useState(geninfo.Notes);
  const [tinnumber, setTINnumber] = useState(geninfo.TINnumber);
  const [sssnumber, setSSSnumber] = useState(geninfo.SSSnumber);
  const [phnumber, setPHnumber] = useState(geninfo.PHnumber);
  const [pinumber, setPInumber] = useState(geninfo.PInumber);
  const [atmnumber, setATMnumber] = useState(geninfo.ATMnumber);

  useEffect(() => {
    if (isSuccess) {
      setBioId("");
      setPrefix("");
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setEmployeeType("");
      setAssignedOutlet("");
      setDepartment("");
      setJobTitle("");
      setDateEmployed("");
      setRegDate("");
      setDateLeaved("");
      setDateProbationary("");
      setEmpStatus("");
      setNotes("");
      setTINnumber("");
      setSSSnumber("");
      setPHnumber("");
      setPInumber("");

      navigate("/employeerecords");
    }
  }, [isSuccess, navigate]);

  /* SUBMIT FUNCTION */
  const onSaveUserClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() && !isLoading) {
      await updateGeninfo({
        id: geninfo.id,
        EmployeeID: geninfo.EmployeeID,
        BioID: bioId,
        Prefix: prefix,
        FirstName: firstName,
        MiddleName: middleName,
        LastName: lastName,
        EmployeeType: employeeType,
        AssignedOutlet: assignedOutlet,
        Department: department,
        JobTitle: jobTitle,
        DateEmployed: dateEmployed,
        RegDate: regDate,
        DateLeaved: dateLeaved,
        DateProbationary: dateProbationary,
        EmpStatus: empStatus,
        Notes: notes,
        TINnumber: tinnumber,
        SSSnumber: sssnumber,
        PHnumber: phnumber,
        PInumber: pinumber,
      });
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  /* DROPDOWN OPTIONS */
  const employeeTypeOptions = Object.entries(EMPLOYEETYPE).map(
    ([key, value]) => {
      return (
        <option key={key} value={value}>
          {key}
        </option>
      );
    }
  );
  const assignedOutletOptions = Object.entries(ASSIGNEDOUTLET).map(
    ([key, value]) => {
      return (
        <option key={key} value={value}>
          {key}
        </option>
      );
    }
  );
  const departmentOptions = Object.entries(DEPARTMENT).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });
  const empStatusOptions = Object.entries(EMPSTATUS).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });
  const prefixOptions = Object.entries(PREFIX).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });

  const [validated, setValidated] = useState(false);

  return (
    <>
      <Container>
        <Form
          className="p-3"
          noValidate
          validated={validated}
          onSubmit={onSaveUserClicked}
        >
          {/* EmployeeID and BioID */}
          <Row className="mb-3">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Employee ID</Form.Label>
              <Form.Control
                required
                autoFocus
                autoComplete="off"
                type="text"
                pattern={ALPHANUM_REGEX}
                disabled
                defaultValue={geninfo.EmployeeID}
              />
              <Form.Control.Feedback type="invalid">
                This field is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Bio ID</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                pattern={NUMBER_REGEX}
                required
                value={bioId}
                onChange={(e) => setBioId(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                This field is required
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* First name, middle name, last name and prefix */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Prefix</Form.Label>
              <Form.Select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
              >
                {prefixOptions}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label className="fw-semibold">First Name</Form.Label>
              <Form.Control
                required
                type="text"
                autoComplete="off"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label className="fw-semibold">Middle Name</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                placeholder="(Optional)"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label className="fw-semibold">Last Name</Form.Label>
              <Form.Control
                required
                type="text"
                autoComplete="off"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Employee type, assigned outlet, department, and job title */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Employee Type</Form.Label>
              <Form.Select
                required
                value={employeeType}
                onChange={(e) => setEmployeeType(e.target.value)}
              >
                {employeeTypeOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Assigned Outlet</Form.Label>
              <Form.Select
                required
                value={assignedOutlet}
                onChange={(e) => setAssignedOutlet(e.target.value)}
              >
                {assignedOutletOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Department</Form.Label>
              <Form.Select
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departmentOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Job Title</Form.Label>
              <Form.Control
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Date employed, date probationary, regular date, notes, date leaved, and notes  */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Date Employed</Form.Label>
              <Form.Control
                required
                autoComplete="off"
                type="date"
                value={dateEmployed}
                onChange={(e) => setDateEmployed(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Probationary Date</Form.Label>
              <Form.Control
                required
                type="date"
                value={dateProbationary}
                onChange={(e) => setDateProbationary(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">
                Regularization Date
              </Form.Label>
              <Form.Control
                type="date"
                value={regDate}
                onChange={(e) => setRegDate(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">
                Date of Resignation
              </Form.Label>
              <Form.Control
                type="date"
                value={dateLeaved}
                onChange={(e) => setDateLeaved(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Employment Status</Form.Label>
              <Form.Select
                onChange={(e) => setEmpStatus(e.target.value)}
                value={empStatus}
              >
                {empStatusOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                This field is required!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">Notes</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Form.Group>
          </Row>
          {/* TIN number, SSS number, PH number, PI number, ATM number */}
          <Row className="mb-3">
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">TIN Number</Form.Label>
              <Form.Control
                required
                type="text"
                pattern={NUMBER_REGEX}
                value={tinnumber}
                onChange={(e) => setTINnumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">SSS Number</Form.Label>
              <Form.Control
                required
                type="text"
                pattern={NUMBER_REGEX}
                value={sssnumber}
                onChange={(e) => setSSSnumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">PH Number</Form.Label>
              <Form.Control
                required
                type="text"
                pattern={NUMBER_REGEX}
                value={phnumber}
                onChange={(e) => setPHnumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">PI Number</Form.Label>
              <Form.Control
                required
                type="text"
                pattern={NUMBER_REGEX}
                value={pinumber}
                onChange={(e) => setPInumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">ATM Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="(Optional for confidentiality)"
                pattern={NUMBER_REGEX}
                value={atmnumber}
                onChange={(e) => setATMnumber(e.target.value)}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Col md="auto">
              <Button variant="outline-success">Save Changes</Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default EditGenInfoForm;
