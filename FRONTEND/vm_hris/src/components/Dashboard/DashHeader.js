import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Nav,
  Navbar,
  Container,
  OverlayTrigger,
  Badge,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { useSendLogoutMutation } from "../../features/auth/authApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import TooltipRenderer from "../../xtra_functions/TooltipRenderer";
import useNotifier from "../../hooks/useNotifier";

const DashHeader = () => {
  // Notifier
  const notifList = useNotifier();

  const location = useLocation();

  const { isX, username } = useAuth();

  const [active, setActive] = useState(1);

  const navigate = useNavigate();

  const [sendLogout, { isError, error }] = useSendLogoutMutation();

  const onLogoutClicked = () => {
    const logoutPromise = new Promise((resolve) =>
      resolve(sendLogout({ username }))
    );
    toast
      .promise(
        logoutPromise,
        {
          pending: "Logging out...",
          success: "Logged out!",
          error: error,
        },
        { containerId: "A" }
      )
      .then(() => {
        navigate("/");
      });
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
    >
      <Container>
        <Navbar.Brand id="logo">Via Mare HRIS</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse id="navbar" className="justify-content-end">
          <Nav activeKey={active} onSelect={handleNavSelect}>
            <Nav.Link eventKey="1" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Nav.Link>
            {!isX.isUser && !isX.isApprover && (
              <>
                <Nav.Link
                  eventKey="2"
                  onClick={() => navigate("/employeerecords")}
                >
                  Employee Records
                </Nav.Link>

                <Nav.Link eventKey="3" onClick={() => navigate("/attendances")}>
                  Attendance
                </Nav.Link>
              </>
            )}
            <Nav.Link eventKey="4" onClick={() => navigate("/leaves")}>
              Leaves
            </Nav.Link>
            {isX.isAdmin && (
              <Nav.Link eventKey="5" onClick={() => navigate("/users")}>
                User Settings
              </Nav.Link>
            )}
            <Nav.Link onClick={onLogoutClicked} className="text-danger">
              Logout
            </Nav.Link>
            {/* <Nav.Item className="ms-2">
              <Image src={imageData} roundedCircle />
            </Nav.Item> */}
            {isX.isAdmin && (
              <OverlayTrigger
                placement="auto"
                overlay={TooltipRenderer({
                  tip: `(${notifList.length}) Notification/s`,
                })}
              >
                <Nav.Item>
                  <DropdownButton
                    align={"end"}
                    size="lg"
                    variant="outline"
                    title={
                      <>
                        <FontAwesomeIcon
                          icon={faBell}
                          className="text-primary float-start"
                        />
                        {notifList.length > 0 && (
                          <Badge pill bg="danger">
                            {notifList.length}
                          </Badge>
                        )}
                      </>
                    }
                  >
                    {notifList.map((notif) => {
                      let bgColor = "";
                      if (
                        notif.msg.toLowerCase().includes("evaluation") ||
                        notif.msg.toLowerCase().includes("will end soon")
                      ) {
                        bgColor = "bg-warning-subtle";
                      }
                      if (
                        notif.msg.toLowerCase().includes("regularization") ||
                        notif.msg.toLowerCase().includes("already ended")
                      ) {
                        bgColor = "bg-danger-subtle";
                      }
                      return (
                        <Dropdown.Item
                          className={`border fw-medium py-2 ${bgColor}`}
                          href={`/employeerecords/${notif.id}`}
                        >
                          {notif.msg}
                        </Dropdown.Item>
                      );
                    })}
                  </DropdownButton>
                </Nav.Item>
              </OverlayTrigger>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  return content;
};

export default DashHeader;
