import React, { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { USERLEVELS, BRANCHES, USERGROUPS } from "../../config/userOptions";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import useTitle from "../../hooks/useTitle";

const USER_REGEX = "[A-z0-9.,_-]{3,20}";
const PWD_REGEX = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}";

const NewUserForm = () => {
  useTitle("Create New User | Via Mare HRIS");

  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  /* VARIABLES */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastname] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [userLevel, setUserLevel] = useState("");
  const [userGroup, setUserGroup] = useState("");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setFirstName("");
      setLastname("");
      setBranch("");
      setEmployeeId("");
      setUserLevel("");
      setUserGroup("");

      toast.success("New user added!");
      navigate("/users");
    }
  }, [isSuccess, navigate]);

  /* HANDLERS */
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onFirstNameChanged = (e) => setFirstName(e.target.value);
  const onLastnameChanged = (e) => setLastname(e.target.value);
  const onEmployeeIdChanged = (e) => setEmployeeId(e.target.value);

  const onUserLevelChanged = (e) => setUserLevel(e.target.value);
  const onBranchChanged = (e) => setBranch(e.target.value);
  const onUserGroupChanged = (e) => setUserGroup(e.target.value);

  /* SUBMIT FUNCTION */
  const onSaveUserClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() === true && !isLoading) {
      await addNewUser({
        username,
        password,
        firstName,
        lastName,
        branch,
        employeeId,
        userLevel,
        userGroup,
      });
    } else {
      e.stopPropagation();
    }

    // Show parts of the form that is valid or not
    setValidated(true);
  };

  /* DROPDOWN OPTIONS */
  const userLevelOptions = Object.values(USERLEVELS).map((userlevel) => {
    return (
      <option key={userlevel} value={userlevel}>
        {userlevel}
      </option>
    );
  });

  const branchOptions = Object.entries(BRANCHES).map(([key, value]) => {
    return (
      <option key={value} value={value}>
        {key}
      </option>
    );
  });

  const userGroupOptions = Object.entries(USERGROUPS).map(([key, value]) => {
    return (
      <option key={value} value={value}>
        {key}
      </option>
    );
  });

  const [validated, setValidated] = useState(false);

  const content = (
    <>
      <Container>
        <Row>
          <Col md="auto">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/users")}
            >
              <FontAwesomeIcon icon={faLeftLong} />
            </Button>
          </Col>
          <Col>
            <h3>Create New User</h3>
            {isError && <p className="text-danger">{error?.data?.message}</p>}
          </Col>
        </Row>
        <Form
          className="p-3"
          noValidate
          validated={validated}
          onSubmit={onSaveUserClicked}
        >
          {/* Username and password */}
          <Row className="mb-3">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Username</Form.Label>
              <Form.Control
                required
                autoFocus
                autoComplete="off"
                type="text"
                placeholder="Username"
                pattern={USER_REGEX}
                onChange={onUsernameChanged}
              />
              <Form.Control.Feedback type="invalid">
                Please put valid username
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Password</Form.Label>
              <Form.Control
                required
                type="password"
                autoComplete="off"
                pattern={PWD_REGEX}
                placeholder="Password"
                onChange={onPasswordChanged}
              />
              <Form.Control.Feedback type="invalid">
                Minimum of 8 characters. At least - 1 uppercase letter, 1
                lowercase letter, 1 unique symbol, and 1 digit/number.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* First name and last name */}
          <Row className="mb-3">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">First Name</Form.Label>
              <Form.Control
                required
                type="text"
                autoComplete="off"
                placeholder="First Name"
                onChange={onFirstNameChanged}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Last Name</Form.Label>
              <Form.Control
                required
                type="text"
                autoComplete="off"
                placeholder="Last Name"
                onChange={onLastnameChanged}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Branch and user group */}
          <Row className="mb-3">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Branch</Form.Label>
              <Form.Select required onChange={onBranchChanged}>
                <option value="">Select branch...</option>
                {branchOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">User Group</Form.Label>
              <Form.Select required onChange={onUserGroupChanged}>
                <option value="">Select group...</option>
                {userGroupOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Employee id and user level */}
          <Row className="mb-3">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Employee ID</Form.Label>
              <Form.Control
                required
                autoComplete="off"
                type="text"
                placeholder="Employee ID"
                onChange={onEmployeeIdChanged}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">User Level</Form.Label>
              <Form.Select required onChange={onUserLevelChanged}>
                <option value="">Select level...</option>
                {userLevelOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Button variant="outline-success" type="submit">
            Add User
          </Button>
        </Form>
      </Container>
    </>
  );

  return content;
};

export default NewUserForm;
