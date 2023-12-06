import React, { useEffect, useState } from "react";
import { Row, Col, Container, Form, InputGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  //const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [validated, setValidated] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {}, []);

  // const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <p>Loading...</p>;

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePassInput = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
    } else {
      try {
        const { accessToken } = await login({ username, password }).unwrap();
        dispatch(setCredentials({ accessToken }));
        setUsername("");
        setPassword("");
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
      }
    }

    setValidated(true);
  };

  const handleShowPass = () => setShowPass(!showPass);

  const content = (
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
              autoFocus
              required
            />
            <Form.Control.Feedback type="invalid">
              Username field is required
            </Form.Control.Feedback>
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
              />
              <Button variant="secondary" onClick={() => handleShowPass()}>
                <FontAwesomeIcon icon={!showPass ? faEye : faEyeSlash} />
              </Button>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              Password field is required
            </Form.Control.Feedback>
          </Form.Group>
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
  );

  return content;
};

export default Login;
