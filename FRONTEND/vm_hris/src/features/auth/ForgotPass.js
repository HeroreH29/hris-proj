import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Container,
  Form,
  InputGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../users/usersApiSlice";
import useTitle from "../../hooks/useTitle";
import { toast } from "react-toastify";

const PWD_REGEX = "(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}";

const ForgotPass = () => {
  useTitle("Forgot Password | Via Mare HRIS");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  const [
    updateUser,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      // eslint-disable-next-line
      isError: isUpdateErr,
      // eslint-disable-next-line
      error: updateerr,
    },
  ] = useUpdateUserMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);

  const [foundUser, setFoundUser] = useState("");
  const [userFound, setUserFound] = useState(undefined);

  useEffect(() => {
    if (isUpdateSuccess) {
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      toast.success("Password reset successful");
      navigate("/");
    }
  }, [isUpdateSuccess, navigate]);

  if (isLoading) return <Spinner animation="border" />;

  if (isError) {
    return <p className="text-danger">{error?.data?.message}</p>;
  }

  const handleFindAccount = () => {
    if (isSuccess) {
      const { ids, entities } = users;

      const foundUserId = ids?.length
        ? ids.find((userId) => entities[userId]?.username === username)
        : null;

      if (foundUserId) {
        setFoundUser(foundUserId);
        setUserFound(true);
      } else {
        setUserFound(false);
      }
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handleNewPassInput = (e) => setPassword(e.target.value);
  const handleConfirmPassInput = (e) => setConfirmPassword(e.target.value);

  const handleShowPass = () => setShowPass(!showPass);
  const handleShowConfirmPass = () => setShowConfirmPass(!showConfirmPass);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
    } else {
      if (password === confirmPassword && !isUpdateLoading) {
        await updateUser({
          ...users.entities[foundUser],
          password: password,
        });
      }
    }

    setValidated(true);
  };

  return (
    <Container className="p-5 rounded bg-light mt-2 mb-2" as={Col} md={5}>
      <div className="mb-3 text-center" id="loginTitle">
        <h2 id="loginTitle">Forgot Password</h2>
        <small className="fst-italic">{`(Put username of account for password reset)`}</small>
      </div>
      <Form
        id="forgotpassform"
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
      >
        {userFound === undefined || !userFound ? (
          <>
            <Row className="d-flex justify-content-center mb-3">
              <Form.Group as={Col} md={"auto"} className="mb-3">
                <Form.Label className="fw-semibold">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={handleUserInput}
                  autoFocus
                  required
                />
                {userFound !== undefined && (
                  <p className="m-1 text-danger">Account not found!</p>
                )}
              </Form.Group>
            </Row>
            <Row
              className="d-flex justify-content-center mb-3"
              as={Col}
              md={"auto"}
            >
              <Button
                type="button"
                variant="primary"
                onClick={handleFindAccount}
              >
                Find Account
              </Button>
            </Row>
          </>
        ) : (
          <>
            <Row className="d-flex justify-content-center mb-3">
              <Form.Group as={Col} md={"auto"} className="mb-3">
                <Form.Label className="fw-semibold">New Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={!showPass ? "password" : "text"}
                    placeholder="Enter New Password"
                    pattern={PWD_REGEX}
                    value={password}
                    onChange={handleNewPassInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Minimum of 8 characters. At least - 1 lowercase letter, 1
                    unique symbol, and 1 digit/number.
                  </Form.Control.Feedback>
                  <Button variant="secondary" onClick={() => handleShowPass()}>
                    <FontAwesomeIcon icon={!showPass ? faEye : faEyeSlash} />
                  </Button>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row className="d-flex justify-content-center mb-3">
              <Form.Group as={Col} md={"auto"} className="mb-3">
                <Form.Label className="fw-semibold">
                  Confirm Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={!showConfirmPass ? "password" : "text"}
                    placeholder="Confirm Password"
                    pattern={PWD_REGEX}
                    value={confirmPassword}
                    onChange={handleConfirmPassInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Must match the new password!
                  </Form.Control.Feedback>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleShowConfirmPass}
                  >
                    <FontAwesomeIcon
                      icon={!showConfirmPass ? faEye : faEyeSlash}
                    />
                  </Button>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row
              className="d-flex justify-content-center mb-3"
              as={Col}
              md={"auto"}
            >
              <Button variant="success" type="submit">
                Reset Password
              </Button>
            </Row>
          </>
        )}
        {/* <Row className="d-flex justify-content-center mb-3">
          <Form.Group as={Col} md={"auto"} className="mb-3">
            <Link to="/forgotpassword" className="fst-italic">
              Forgot password?
            </Link>
          </Form.Group>
        </Row> */}
        <Row
          className="d-flex justify-content-center mb-3"
          as={Col}
          md={"auto"}
        >
          <Link to="/" className="fst-italic">
            Back to login
          </Link>
        </Row>
      </Form>
    </Container>
  );
};

export default ForgotPass;
