import React, { useEffect } from "react";
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
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import useAuthForm from "../../hooks/useAuthForm";
import usePersist from "../../hooks/usePersist";

const Login = () => {
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { state, dispatch: stateDispatch } = useAuthForm();
  const [login, { isLoading, isSuccess }] = useLoginMutation();

  // Login feedback
  useEffect(() => {
    if (isSuccess) {
      toast.success(`Welcome back ${state.username}!`);
    }
    // eslint-disable-next-line
  }, [isSuccess]);

  if (isLoading) return <Spinner animation="border" />;

  const handleToggle = () => setPersist((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
    } else {
      try {
        let username = state.username;
        let password = state.password;

        const { accessToken } = await login({ username, password }).unwrap();
        if (accessToken) {
          dispatch(setCredentials({ accessToken }));
          navigate("/dashboard");
        }
      } catch (error) {
        if (error.status === 401) {
          toast.warn(error.data.message);
          stateDispatch({ type: "input_username", username: "" });
        } else if (error.status === 404) {
          toast.warn(error.data.message);
          stateDispatch({ type: "input_username", username: "" });
        }
        stateDispatch({ type: "input_password", password: "" });
        stateDispatch({ type: "show_password", showPass: false });
      }
    }

    stateDispatch({
      type: "validated",
      validated: true,
    });
  };

  const content = (
    <>
      <Container className="p-5 rounded bg-light mt-2 mb-2" as={Col} md={5}>
        <div className="mb-3" id="loginTitle">
          <h2 id="loginTitle" className="text-center">
            Via Mare HRIS Login
          </h2>
        </div>
        <Form
          id="loginform"
          noValidate
          validated={state.validated}
          onSubmit={handleSubmit}
        >
          <Row className="d-flex justify-content-center mb-3">
            <Form.Group as={Col} md={"auto"} className="mb-3">
              <Form.Label className="fw-semibold">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                value={state.username}
                onChange={(e) => {
                  stateDispatch({
                    type: "input_username",
                    username: e.target.value,
                  });
                }}
                autoFocus
                required
              />
            </Form.Group>
          </Row>
          <Row className="d-flex justify-content-center mb-3">
            <Form.Group as={Col} md={"auto"} className="mb-3">
              <Form.Label className="fw-semibold">Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={!state.showPass ? "password" : "text"}
                  placeholder="Enter Password"
                  value={state.password}
                  onChange={(e) => {
                    stateDispatch({
                      type: "input_password",
                      password: e.target.value,
                    });
                  }}
                  required
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    stateDispatch({
                      type: "show_password",
                    });
                  }}
                >
                  <FontAwesomeIcon
                    icon={!state.showPass ? faEye : faEyeSlash}
                  />
                </Button>
              </InputGroup>
            </Form.Group>
          </Row>
          <Row className="d-flex justify-content-center mb-3">
            <Form.Group as={Col} md={"auto"} className="mb-3">
              <Link to="/forgotpassword" className="fst-italic">
                Forgot password?
              </Link>
            </Form.Group>
          </Row>
          <Row
            className="d-flex justify-content-center mb-3"
            as={Col}
            md={"auto"}
          >
            <Form.Check
              type="checkbox"
              label="Trust this device"
              checked={persist}
              onChange={handleToggle}
            />
          </Row>
          <Row
            className="d-flex justify-content-center mb-3"
            as={Col}
            md={"auto"}
          >
            <Button type="submit" variant="outline-success">
              Login
            </Button>
          </Row>
        </Form>
      </Container>
    </>
  );

  return content;
};

export default Login;
