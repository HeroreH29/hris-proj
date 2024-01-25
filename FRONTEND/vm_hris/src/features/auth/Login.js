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
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

import usePersist from "../../hooks/usePersist";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [validated, setValidated] = useState(false);
  const [passInvalid, setPassInvalid] = useState(false);
  const [userInvalid, setUserInvalid] = useState(false);

  const [login, { isLoading, isSuccess }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success(`Welcome back ${username}!`);
    }
    // eslint-disable-next-line
  }, [isSuccess]);

  if (isLoading) return <Spinner animation="border" />;

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePassInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
    } else {
      try {
        const { accessToken } = await login({ username, password }).unwrap();
        if (accessToken) {
          dispatch(setCredentials({ accessToken }));
          setUsername("");
          setPassword("");
          setPassInvalid(false);
          setUserInvalid(false);
          navigate("/dashboard");
        }
      } catch (error) {
        if (error.status === 401 || error.status === 404) {
          alert("Username or password incorrect");
          setPassInvalid(true);
          setUserInvalid(true);
          setUsername("");
          setPassword("");
        }
      }
    }

    setValidated(true);
  };

  const handleShowPass = () => setShowPass(!showPass);

  const content = (
    <>
      <Container className="p-5 rounded bg-light mt-2 mb-2" as={Col} md={5}>
        <div className="mb-3" id="loginTitle">
          <h2 id="loginTitle" className="text-center">
            Via Mare HRIS Login
          </h2>
        </div>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="d-flex justify-content-center mb-3">
            <Form.Group as={Col} md={"auto"} className="mb-3">
              <Form.Label className="fw-semibold">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={handleUserInput}
                isInvalid={userInvalid}
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
                  type={!showPass ? "password" : "text"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={handlePassInput}
                  required
                  isInvalid={passInvalid}
                />
                <Button variant="secondary" onClick={() => handleShowPass()}>
                  <FontAwesomeIcon icon={!showPass ? faEye : faEyeSlash} />
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
            <Button type="submit" variant="success">
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
