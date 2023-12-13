import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Navbar, Image, Container, Col, Row } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

import { useSendLogoutMutation } from "../../features/auth/authApiSlice";

const DashHeader = () => {
  const { isHR, isAdmin } = useAuth();

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
    <Navbar
      collapseOnSelect={true}
      expand="lg"
      className="border-bottom border-dark-subtle"
    >
      <Container>
        <Navbar.Brand id="logo">Via Mare</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link href="#dashboard" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Nav.Link>
            {(isHR || isAdmin) && (
              <Nav.Link
                href="#employeerecords"
                onClick={() => navigate("/employeerecords")}
              >
                Employee Records
              </Nav.Link>
            )}
            {(isHR || isAdmin) && (
              <Nav.Link
                href="#attendances"
                onClick={() => console.log("/attendances")}
              >
                Attendance
              </Nav.Link>
            )}
            <Nav.Link href="#leaves" onClick={() => console.log("/leaves")}>
              Leave Tracker
            </Nav.Link>
            {(isHR || isAdmin) && (
              <Nav.Link href="#users" onClick={() => navigate("/users")}>
                User Settings
              </Nav.Link>
            )}
            <Nav.Link
              href="#logout"
              onClick={onLogoutClicked}
              className="text-danger"
            >
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
