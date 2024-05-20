import React, { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { USERLEVELS, USERGROUPS } from "../../config/userOptions";
import {
  Form,
  Button,
  Col,
  Row,
  Container,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faLeftLong,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import useTitle from "../../hooks/useTitle";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import useUserForm from "../../hooks/useUserForm";

//const USER_REGEX = "[A-z0-9.,_-]{3,20}";
const PWD_REGEX = "(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}";

const NewUserForm = () => {
  useTitle("New User | Via Mare HRIS");

  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const { data: geninfos, isSuccess: genSuccess } = useGetGeninfosQuery();

  const navigate = useNavigate();

  /* VARIABLES */
  const { userState, userDispatch } = useUserForm({});

  const [searchResults, setSearchResults] = useState("");
  const [selectedResult, setSelectedResult] = useState("");
  const [searchBar, setSearchBar] = useState("");

  useEffect(() => {
    if (isSuccess) {
      toast.success("New user added!");
      navigate("/users");
    }

    if (isError) {
      toast.error(error.data.message);
    }
  }, [isSuccess, isError, error, navigate]);

  /* HANDLERS */
  const onUsernameChanged = (e) =>
    userDispatch({ type: "username", username: e.target.value });
  const onPasswordChanged = (e) =>
    userDispatch({ type: "password", password: e.target.value });
  const onShowPassword = () => userDispatch({ type: "showpass" });
  const onUserLevelChanged = (e) =>
    userDispatch({ type: "userLevel", userLevel: e.target.value });
  const onUserGroupChanged = (e) =>
    userDispatch({ type: "userGroup", userGroup: e.target.value });

  /* SUBMIT FUNCTION */
  const onSaveUserClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const { showPass, active, ...others } = userState;

    if (form.checkValidity() === true && !isLoading) {
      await addNewUser(others);
    } else {
      e.stopPropagation();
    }

    // Show parts of the form that is valid or not
    setValidated(true);
  };

  /* DROPDOWN OPTIONS */
  const userLevelOptions = Object.values(USERLEVELS)
    .sort((a, b) => a.localeCompare(b))
    .map((userlevel) => {
      return (
        <option key={userlevel} value={userlevel}>
          {userlevel}
        </option>
      );
    });
  const userGroupOptions = Object.values(USERGROUPS)
    .sort((a, b) => a.localeCompare(b))
    .map((usergroup) => {
      return (
        <option key={usergroup} value={usergroup}>
          {usergroup}
        </option>
      );
    });

  const [validated, setValidated] = useState(false);

  const handleSearchEmployees = (searchTxt) => {
    setSearchBar(searchTxt);
    if (genSuccess) {
      const { ids, entities } = geninfos;

      // Clear previous search results if search text is empty
      if (!searchTxt.trim()) {
        setSearchResults([]);
        return; // Exit early if search text is empty
      }

      // Filter employees based on search text
      const filteredEmployees = ids
        .map((id) => entities[id])
        .filter((employee) => {
          const fullName =
            `${employee.FirstName} ${employee.LastName}`.toLowerCase();
          return fullName.includes(searchTxt.toLowerCase());
        });

      setSearchResults(filteredEmployees);
    }
  };

  const searchResultClick = (employee) => {
    setSearchBar(`${employee.FirstName} ${employee.LastName}`);
    setSearchResults("");
    setSelectedResult(employee);
    if (genSuccess) {
      userDispatch({
        type: "employeeSelect",
        employee: employee.id,
      });
    }
  };

  const content = (
    <>
      <Container>
        {/* <Row>
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
            {isError && (
              <p className="text-danger fw-bold">{error?.data?.message}</p>
            )}
          </Col>
        </Row> */}
        <Form
          className="p-3"
          noValidate
          validated={validated}
          onSubmit={onSaveUserClicked}
        >
          {/* Search bar */}
          <Row className="mb-3">
            <Form.Label className="fw-semibold">Create account for:</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                value={searchBar}
                onChange={(e) => handleSearchEmployees(e.target.value)}
              />
              <Button variant="outline-secondary" disabled>
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </InputGroup>
            {searchResults?.length > 0 && (
              <ListGroup>
                {searchResults.map((employee) => (
                  <ListGroup.Item
                    action
                    href="#"
                    key={employee.id}
                    onClick={() => searchResultClick(employee)}
                  >
                    {employee.FirstName} {employee.LastName}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
            {/* Username */}
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Username</Form.Label>
              <Form.Control
                required
                autoFocus
                autoComplete="off"
                type="text"
                placeholder="Username"
                onChange={onUsernameChanged}
              />
              <Form.Control.Feedback type="invalid">
                Please put valid username
              </Form.Control.Feedback>
            </Form.Group>
            {/* Password */}
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={!userState.showPass ? "password" : "text"}
                  autoComplete="off"
                  pattern={PWD_REGEX}
                  placeholder="Password"
                  onChange={onPasswordChanged}
                />
                <Button variant="outline-secondary" onClick={onShowPassword}>
                  <FontAwesomeIcon
                    icon={!userState.showPass ? faEye : faEyeSlash}
                  />
                </Button>
                <Form.Control.Feedback type="invalid">
                  Minimum of 8 characters. At least - 1 lowercase letter, 1
                  unique symbol, and 1 digit/number.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          {/* First name and last name */}
          <Row className="mb-3">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">First Name</Form.Label>
              <Form.Control
                required
                type="text"
                disabled
                autoComplete="off"
                placeholder="First Name"
                value={selectedResult.FirstName}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Last Name</Form.Label>
              <Form.Control
                required
                type="text"
                disabled
                autoComplete="off"
                placeholder="Last Name"
                value={selectedResult.LastName}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          {/* Branch/outlet and user group */}
          <Row className="mb-3">
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">Branch/Outlet</Form.Label>
              <Form.Control
                disabled
                required
                value={selectedResult.AssignedOutlet}
                placeholder="Branch/Outlet"
              />
              <Form.Control.Feedback type="invalid">
                Select an option
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">User Group</Form.Label>
              <Form.Select
                required
                value={userState.userGroup}
                onChange={onUserGroupChanged}
              >
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
                disabled
                type="text"
                placeholder="Employee ID"
                value={selectedResult.EmployeeID}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md={"4"}>
              <Form.Label className="fw-semibold">User Level</Form.Label>
              <Form.Select
                required
                value={userState.userLevel}
                onChange={onUserLevelChanged}
              >
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
