import React from "react";
import { Row, Col } from "react-bootstrap";

const Login = () => {
  return (
    <Row className="d-flex justify-content-center">
      <Col md="auto">
        <div className="p-5 rounded container bg-light mt-2 mb-2">
          <div className="mb-3" id="loginTitle">
            <h2 className="text-center">Welcome to HRIS!</h2>
          </div>
          <div id="loginForm">
            <form /* onSubmit={handleLogin} */>
              <div className="row justify-content-center">
                <div className="col-auto">
                  <strong className="float-start">Username:</strong>
                  <input
                    className="form-control"
                    type="text"
                    name="user"
                    /* value={username} */
                    /* onChange={(e) => setUsername(e.target.value)} */
                    required
                    autoFocus
                    /* onInput={(e) => {
                      e.target.value = e.target.value.replace(
                        /[^a-zA-Z0-9]/g,
                        ""
                      );
                    }} */
                  />
                </div>
              </div>
              <div className="row justify-content-center mt-3">
                <div className="col-auto">
                  <strong className="float-start">Password:</strong>
                  <input
                    className="form-control"
                    type="password"
                    name="pwd"
                    /* value={password} */
                    /* onChange={(e) => setPassword(e.target.value)} */
                    required
                  />
                </div>
              </div>
              <div className="contatiner text-center">
                <button className="btn btn-outline-primary mt-3 mb-2">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
