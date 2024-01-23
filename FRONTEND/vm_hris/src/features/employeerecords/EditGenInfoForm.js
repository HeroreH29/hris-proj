import React, { useState, useEffect } from "react";
import {
  useAddGeninfoMutation,
  useUpdateGeninfoMutation,
} from "./recordsApiSlice";
import { useNavigate } from "react-router-dom";
import {
  ASSIGNEDOUTLET,
  DEPARTMENT,
  EMPLOYEETYPE,
  EMPSTATUS,
  PREFIX,
} from "../../config/gInfoOptions";
import {
  Form,
  Button,
  Col,
  Row,
  Container,
  InputGroup,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { format, parse } from "date-fns";
import { toast } from "react-toastify";

const NUMBER_REGEX = /^[0-9]*$/;
const IDNUMS_REGEX = /^[0-9-]*$/;
const ALPHANUM_REGEX = /^[A-z0-9]+$/;

const EditGenInfoForm = ({ geninfo }) => {
  // eslint-disable-next-line
  const [
    updateGeninfo,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateGeninfoMutation();

  const [
    addGeninfo,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddGeninfoMutation();

  const navigate = useNavigate();

  const parsedDE = geninfo?.DateEmployed
    ? parse(geninfo?.DateEmployed, "MMM dd, yyyy", new Date())
    : "";
  const parsedRD = geninfo?.RegDate
    ? parse(geninfo?.RegDate, "MMMM dd, yyyy", new Date())
    : "";
  const parsedDL = geninfo?.DateLeaved
    ? parse(geninfo?.DateLeaved, "MMM dd, yyyy", new Date())
    : "";
  const parsedDP = geninfo?.DateProbationary
    ? parse(geninfo?.DateProbationary, "MMM dd, yyyy", new Date())
    : "";

  /* GENINFO VARIABLES */
  const [employeeId, setEmployeeId] = useState(geninfo?.EmployeeID);
  const [bioId, setBioId] = useState(geninfo?.BioID);
  const [prefix, setPrefix] = useState(geninfo?.Prefix);
  const [firstName, setFirstName] = useState(geninfo?.FirstName);
  const [middleName, setMiddleName] = useState(geninfo?.MiddleName);
  const [lastName, setLastName] = useState(geninfo?.LastName);
  const [employeeType, setEmployeeType] = useState(geninfo?.EmployeeType);
  const [assignedOutlet, setAssignedOutlet] = useState(geninfo?.AssignedOutlet);
  const [department, setDepartment] = useState(geninfo?.Department);
  const [jobTitle, setJobTitle] = useState(geninfo?.JobTitle);
  const [dateEmployed, setDateEmployed] = useState(
    parsedDE ? format(parsedDE, "yyyy-MM-dd") : ""
  );
  const [regDate, setRegDate] = useState(
    parsedRD ? format(parsedRD, "yyyy-MM-dd") : ""
  );
  const [dateLeaved, setDateLeaved] = useState(
    parsedDL ? format(parsedDL, "yyyy-MM-dd") : ""
  );
  const [dateProbationary, setDateProbationary] = useState(
    parsedDP ? format(parsedDP, "yyyy-MM-dd") : ""
  );
  const [empStatus, setEmpStatus] = useState(geninfo?.EmpStatus);
  const [notes, setNotes] = useState(geninfo?.Notes);
  const [tinnumber, setTINnumber] = useState(geninfo?.TINnumber);
  const [sssnumber, setSSSnumber] = useState(geninfo?.SSSnumber);
  const [phnumber, setPHnumber] = useState(geninfo?.PHnumber);
  const [pinumber, setPInumber] = useState(geninfo?.PInumber);
  const [atmnumber, setATMnumber] = useState(geninfo?.ATMnumber);

  useEffect(() => {
    if (updateSuccess || addSuccess) {
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

      addSuccess && toast.success("Record successfully added!");
      updateSuccess && toast.info("Record updated!");

      navigate("/employeerecords");
    }
  }, [updateSuccess, addSuccess, navigate]);

  /* DATE REVERT */
  const dateRevert = (dateString, formatString) => {
    return format(parse(dateString, "yyyy-MM-dd", new Date()), formatString);
  };

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() && (!updateLoading || !addLoading)) {
      const confirm = window.confirm("Proceed with these information?");

      if (confirm) {
        // Revert dates
        const revertedDE = dateEmployed
          ? dateRevert(dateEmployed, "MMM dd, yyyy")
          : "";
        const revertedDP = dateProbationary
          ? dateRevert(dateProbationary, "MMM dd, yyyy")
          : "";
        const revertedRD = regDate ? dateRevert(regDate, "MMMM dd, yyyy") : "";
        const revertedDL = dateLeaved
          ? dateRevert(dateLeaved, "MMM dd, yyyy")
          : "";

        // Check if user is adding or updating an employee record
        if (geninfo) {
          await updateGeninfo({
            id: geninfo?.id,
            EmployeeID: employeeId,
            BioID: bioId,
            Prefix: prefix,
            FirstName: firstName,
            MiddleName: middleName,
            LastName: lastName,
            EmployeeType: employeeType,
            AssignedOutlet: assignedOutlet,
            Department: department,
            JobTitle: jobTitle,
            DateEmployed: revertedDE,
            RegDate: revertedRD,
            DateLeaved: revertedDL,
            DateProbationary: revertedDP,
            EmpStatus: empStatus,
            Notes: notes,
            ATMnumber: atmnumber,
            TINnumber: tinnumber,
            SSSnumber: sssnumber,
            PHnumber: phnumber,
            PInumber: pinumber,
          });
        } else {
          await addGeninfo({
            EmployeeID: employeeId,
            BioID: bioId,
            Prefix: prefix,
            FirstName: firstName,
            MiddleName: middleName,
            LastName: lastName,
            EmployeeType: employeeType,
            AssignedOutlet: assignedOutlet,
            Department: department,
            JobTitle: jobTitle,
            DateEmployed: revertedDE,
            RegDate: revertedRD,
            DateLeaved: revertedDL,
            DateProbationary: revertedDP,
            EmpStatus: empStatus,
            Notes: notes,
            ATMnumber: atmnumber,
            TINnumber: tinnumber,
            SSSnumber: sssnumber,
            PHnumber: phnumber,
            PInumber: pinumber,
          });
        }
      }
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  /* USER INPUT CHANGE */
  const userInputChange = (e, REGEX = RegExp | null, setStateVariable) => {
    const inputValue = e.target.value;

    if (REGEX) {
      if (REGEX.test(inputValue) || inputValue === "") {
        setStateVariable(inputValue);
      }
    } else {
      setStateVariable(inputValue);
    }
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
        <Dropdown.Item
          key={key}
          value={value}
          as="option"
          onClick={() => setAssignedOutlet(value)}
        >
          {key}
        </Dropdown.Item>
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
          onSubmit={onSaveInfoClicked}
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
                value={employeeId}
                onChange={(e) =>
                  userInputChange(e, ALPHANUM_REGEX, setEmployeeId)
                }
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
                required
                value={bioId}
                onChange={(e) => userInputChange(e, NUMBER_REGEX, setBioId)}
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
              <InputGroup>
                <Form.Control
                  required
                  type="text"
                  value={assignedOutlet}
                  onChange={(e) => setAssignedOutlet(e.target.value)}
                />
                <DropdownButton variant="outline-secondary" title="Options">
                  {assignedOutletOptions}
                </DropdownButton>
              </InputGroup>
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
                value={tinnumber}
                onChange={(e) => userInputChange(e, IDNUMS_REGEX, setTINnumber)}
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">SSS Number</Form.Label>
              <Form.Control
                required
                type="text"
                value={sssnumber}
                onChange={(e) => userInputChange(e, IDNUMS_REGEX, setSSSnumber)}
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">PH Number</Form.Label>
              <Form.Control
                required
                type="text"
                value={phnumber}
                onChange={(e) => userInputChange(e, IDNUMS_REGEX, setPHnumber)}
              />
            </Form.Group>
            <Form.Group as={Col} md="auto">
              <Form.Label className="fw-semibold">PI Number</Form.Label>
              <Form.Control
                required
                type="text"
                value={pinumber}
                onChange={(e) => userInputChange(e, IDNUMS_REGEX, setPInumber)}
              />
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label className="fw-semibold">ATM Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="(Optional for confidentiality)"
                value={atmnumber}
                onChange={(e) => userInputChange(e, IDNUMS_REGEX, setATMnumber)}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Col md="auto">
              <Button type="submit" variant="outline-success">
                {geninfo ? "Save Change" : "Proceed"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

export default EditGenInfoForm;
