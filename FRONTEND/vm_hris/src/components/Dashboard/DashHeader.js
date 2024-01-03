import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, Navbar, Image, Container } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

import { useSendLogoutMutation } from "../../features/auth/authApiSlice";

const DashHeader = () => {
  const { isHR, isAdmin } = useAuth();

  const [active, setActive] = useState(1);

  // eslint-disable-next-line
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

  const handleNavSelect = (e) => setActive(e);

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
          <Nav activeKey={active} onSelect={handleNavSelect}>
            <Nav.Link eventKey="1" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Nav.Link>
            {(isHR || isAdmin) && (
              <Nav.Link
                eventKey="2"
                onClick={() => navigate("/employeerecords")}
              >
                Employee Records
              </Nav.Link>
            )}
            {(isHR || isAdmin) && (
              <Nav.Link
                eventKey="3"
                onClick={() => console.log("/attendances")}
              >
                Attendance
              </Nav.Link>
            )}
            <Nav.Link eventKey="4" onClick={() => console.log("/leaves")}>
              Leave Tracker
            </Nav.Link>
            {(isHR || isAdmin) && (
              <Nav.Link eventKey="5" onClick={() => navigate("/users")}>
                User Settings
              </Nav.Link>
            )}
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
