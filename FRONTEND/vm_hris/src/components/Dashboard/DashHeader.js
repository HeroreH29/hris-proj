import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Nav, Navbar, Image, Container } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

import { useSendLogoutMutation } from "../../features/auth/authApiSlice";

const DashHeader = () => {
  const location = useLocation();

  const { isHR, isAdmin, isOutletProcessor, username } = useAuth();

  const toastId = useRef(null);

  const [active, setActive] = useState(1);

  const notify = () =>
    (toastId.current = toast("Logging out...", { autoClose: false }));

  const update = () =>
    toast.update(toastId.current, {
      render: "Logged out",
      type: "success",
      autoClose: 2000,
    });

  // eslint-disable-next-line
  const [imageData, setImageData] = useState("https://placehold.jp/40x40.png");

  const navigate = useNavigate();

  const [sendLogout, { isSuccess, isError, error }] = useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      // Update toast when logged out successfully
      update();
      navigate("/");
    }
  }, [isSuccess, navigate]);

  const onLogoutClicked = async () => {
    sendLogout({ username });

    notify();
  };

  const toastDismisser = () => {
    toast.dismiss();
  };

  // Active page identifier
  useEffect(() => {
    const currentLoc = location.pathname;

    if (currentLoc.includes("/dashboard")) {
      setActive(1);
    } else if (currentLoc.includes("/employeerecords")) {
      setActive(2);
    } else if (currentLoc.includes("/attendances")) {
      setActive(3);
    } else if (currentLoc.includes("/leaves")) {
      setActive(4);
    } else if (currentLoc.includes("/users")) {
      setActive(5);
    }
  }, [location.pathname]);

  if (isError) return <p>Error: {error?.data?.message}</p>;

  const handleNavSelect = (e) => setActive(e);

  const content = (
    <Navbar
      collapseOnSelect={true}
      expand="lg"
      className="border-bottom border-dark-subtle bg-white"
      onSelect={toastDismisser}
    >
      <Container>
        <Navbar.Brand id="logo">Via Mare HRIS</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse id="navbar" className="justify-content-end">
          <Nav activeKey={active} onSelect={handleNavSelect}>
            <Nav.Link eventKey="1" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Nav.Link>
            {(isHR || isAdmin || isOutletProcessor) && (
              <Nav.Link
                eventKey="2"
                onClick={() => navigate("/employeerecords")}
              >
                Employee Records
              </Nav.Link>
            )}
            {(isHR || isAdmin || isOutletProcessor) && (
              <Nav.Link eventKey="3" onClick={() => navigate("/attendances")}>
                Attendances
              </Nav.Link>
            )}
            <Nav.Link eventKey="4" onClick={() => navigate("/leaves")}>
              Leaves
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
