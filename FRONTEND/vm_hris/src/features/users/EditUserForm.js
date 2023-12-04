import React, { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { USERLEVELS, USERGROUPS, BRANCHES } from "../../config/userOptions";
import { Form, Button, Col, Row, Container } from "react-bootstrap";

const USER_REGEX = "[A-z0-9]{3,20}";
const PWD_REGEX = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}";

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation(0);

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  /* VARIABLES */
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastname] = useState(user.lastName);
  const [employeeId, setEmployeeId] = useState(user.employeeId);

  const [userLevel, setUserLevel] = useState(user.userLevel);
  const [userGroup, setUserGroup] = useState(user.userGroup);
  const [branch, setBranch] = useState(user.branch);
  const [active, setActive] = useState(user.active);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setFirstName("");
      setLastname("");
      setBranch("");
      setUserGroup("");
      setEmployeeId("");
      setUserLevel("");

      navigate("/dashboard/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  /* HANDLERS */
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onFirstNameChanged = (e) => setFirstName(e.target.value);
  const onLastnameChanged = (e) => setLastname(e.target.value);
  const onEmployeeIdChanged = (e) => setEmployeeId(e.target.value);

  const onUserLevelChanged = (e) => setUserLevel(e.target.value);
  const onUserGroupChanged = (e) => setUserGroup(e.target.value);
  const onBranchChanged = (e) => setBranch(e.target.value);
  const onActiveChanged = () => setActive((prev) => !prev);

  const onSaveUserClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() === true && !isLoading) {
      if (password) {
        // If password is included in the form, update the password
        await updateUser({
          id: user.id,
          username,
          password,
          firstName,
          lastName,
          branch,
          userGroup,
          employeeId,
          userLevel,
          active,
        });
      } else {
        await updateUser({
          id: user.id,
          username,
          firstName,
          lastName,
          branch,
          userGroup,
          employeeId,
          userLevel,
          active,
        });
      }
    } else {
      e.stopPropagation();
    }

    // Show parts of the form that is valid or not
    setValidated(true);
  };

  const onDeleteUserClicked = async (e) => {
    console.log(user.id);
    const isConfirmed = window.confirm(`Proceed deletion of "${username}"?`);
    isConfirmed
      ? await deleteUser({ id: user.id })
      : console.log("Deletion cancelled");
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
        <h3>Edit User</h3>
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
                value={username}
                onChange={onUsernameChanged}
              />
              <Form.Control.Feedback type="invalid">
                Please put valid username
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Password</Form.Label>
              <small>{` [empty field = no change]`}</small>
              <Form.Control
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
                value={firstName}
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
                value={lastName}
                onChange={onLastnameChanged}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Branch and user group */}
          <Row className="mb-3">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Branch</Form.Label>
              <Form.Select required value={branch} onChange={onBranchChanged}>
                {branchOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">User Group</Form.Label>
              <Form.Select
                required
                value={userGroup}
                onChange={onUserGroupChanged}
              >
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
                value={employeeId}
                onChange={onEmployeeIdChanged}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">User Level</Form.Label>
              <Form.Select
                required
                value={userLevel}
                onChange={onUserLevelChanged}
              >
                {userLevelOptions}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* User status */}
          <Row className="mb-3">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">User Status</Form.Label>
              <Form.Check
                type="switch"
                label={active ? "Active" : "Inactive"}
                checked={active}
                onChange={onActiveChanged}
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Col md={"auto"}>
              <Button variant="outline-success" type="submit">
                Add User
              </Button>
            </Col>
            <Col md={"auto"}>
              <Button
                variant="outline-danger"
                type="button"
                onClick={() => onDeleteUserClicked()}
              >
                Delete User
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );

  return content;
};

export default EditUserForm;
