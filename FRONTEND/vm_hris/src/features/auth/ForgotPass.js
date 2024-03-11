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
import useAuthForm from "../../hooks/useAuthForm";

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

  const { state, dispatch: stateDispatch } = useAuthForm();

  const navigate = useNavigate();

  const [foundUser, setFoundUser] = useState("");

  useEffect(() => {
    if (isUpdateSuccess) {
      toast.success("Password reset successful");
      navigate("/");
    }
  }, [isUpdateSuccess, navigate]);

  if (isLoading) return <Spinner animation="border" />;

  if (isError) {
    return <p className="text-danger">{error?.data?.message}</p>;
  }

  const handleUserInput = (e) => {
    stateDispatch({ type: "input_username", username: e.target.value });
  };
  const handleNewPassInput = (e) => {
    stateDispatch({ type: "input_password", password: e.target.value });
  };
  const handleConfirmPassInput = (e) => {
    stateDispatch({
      type: "confirm_password",
      confirmPassword: e.target.value,
    });
  };

  const handleShowPass = () => {
    stateDispatch({ type: "show_password" });
  };

  const findAccount = () => {
    if (!isSuccess) return false;

    const { ids, entities } = users;
    const foundUserId = ids?.find(
      (userId) => entities[userId]?.username === state.username
    );

    if (foundUserId) {
      setFoundUser(foundUserId);
      stateDispatch({ type: "validated", validated: false });
      return true;
    } else {
      stateDispatch({ type: "input_username", username: "" });
      setFoundUser(null);
      stateDispatch({ type: "validated", validated: true });
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const accountFound = findAccount();

    if (!form.checkValidity() || !accountFound) {
      e.stopPropagation();
      stateDispatch({ type: "validated", validated: true });
      return;
    }

    if (state.password === state.confirmPassword && !isUpdateLoading) {
      await updateUser({
        ...users.entities[foundUser],
        password: state.password,
      });
    }
    stateDispatch({ type: "validated", validated: false });
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
        validated={state.validated}
        onSubmit={handleSubmit}
      >
        {!foundUser ? (
          <>
            <Row className="d-flex justify-content-center mb-3">
              <Form.Group as={Col} md={"auto"} className="mb-3">
                <Form.Label className="fw-semibold">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Username"
                  value={state.username}
                  onChange={handleUserInput}
                  autoFocus
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Account not found
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row
              className="d-flex justify-content-center mb-3"
              as={Col}
              md={"auto"}
            >
              <Button type="button" variant="primary" onClick={handleSubmit}>
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
                    type={!state.showPass ? "password" : "text"}
                    placeholder="Enter New Password"
                    pattern={PWD_REGEX}
                    value={state.password}
                    onChange={handleNewPassInput}
                    required
                  />
                  <Button variant="secondary" onClick={() => handleShowPass()}>
                    <FontAwesomeIcon
                      icon={!state.showPass ? faEye : faEyeSlash}
                    />
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    Minimum of 8 characters. At least - 1 lowercase letter, 1
                    unique symbol, and 1 digit/number.
                  </Form.Control.Feedback>
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
                    type={!state.showPass ? "password" : "text"}
                    placeholder="Confirm Password"
                    pattern={PWD_REGEX}
                    value={state.confirmPassword}
                    onChange={handleConfirmPassInput}
                    required
                  />
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleShowPass}
                  >
                    <FontAwesomeIcon
                      icon={!state.showPass ? faEye : faEyeSlash}
                    />
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    Must match the new password!
                  </Form.Control.Feedback>
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
        <Row
          className="d-flex justify-content-center mb-3"
          as={Col}
          md={"auto"}
        >
          <Link
            to="/"
            className="fst-italic"
            onClick={() => {
              console.log(state.validated);
              stateDispatch({ type: "validated", validated: false });
            }}
          >
            Back to login
          </Link>
        </Row>
      </Form>
    </Container>
  );
};

export default ForgotPass;
