import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Nav, Navbar, Image, Container, Col, Row } from "react-bootstrap";

import { useSendLogoutMutation } from "../../features/auth/authApiSlice";

const DashHeader = () => {
  const [imageData, setImageData] = useState("https://placehold.jp/40x40.png");

  const navigate = useNavigate();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const onLogoutClicked = () => sendLogout();

  if (isLoading) return <p>Logging out...</p>;

  if (isError) return <p>Error: {error?.data?.message}</p>;

  const content = (
    <Navbar expand="lg" className="border-bottom border-dark-subtle">
      <Container>
        <Navbar.Brand id="logo">Via Mare</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link onClick={() => navigate("/dashboard")}>
              Dashboard
            </Nav.Link>
            <Nav.Link onClick={() => console.log("/erecords")}>
              Employee Records
            </Nav.Link>
            <Nav.Link onClick={() => console.log("/attendances")}>
              Attendance
            </Nav.Link>
            <Nav.Link onClick={() => console.log("/leaves")}>
              Leave Tracker
            </Nav.Link>
            <Nav.Link onClick={() => navigate("/users")}>
              User Settings
            </Nav.Link>
            <Nav.Link onClick={onLogoutClicked} className="text-danger">
              Logout
            </Nav.Link>
            <Nav.Item className="ms-2">
              <Image src={imageData} roundedCircle />
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  return content;
};

export default DashHeader;
