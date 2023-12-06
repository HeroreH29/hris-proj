import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
// import { Button } from "react-bootstrap";

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

  if (isError) return <p>Error: {error.data?.message}</p>;

  const content = (
    <header>
      <nav className="navbar navbar-expand-lg border-bottom border-dark-subtle">
        <div className="container">
          <a href="/" className="navbar-brand" id="logo">
            Via Mare
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#headerNavbarDropdown"
            aria-controls="headerNavbarDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="headerNavbarDropdown"
          >
            <ul className="navbar-nav ml-auto">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>

              <li className="nav-item">
                <a className="nav-link" href="/erecords">
                  Employee Records
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/attendance">
                  Attendance
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/leaveTracker">
                  Leave Tracker
                </a>
              </li>
              <Link to="/users" className="nav-link">
                {" "}
                User Settings
              </Link>
              {/* <Button variant="outline-secondary" onClick={onLogoutClicked}>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </Button> */}
              <Link onClick={onLogoutClicked} className="nav-link text-danger">
                Logout
              </Link>

              <li className="nav-item ms-2">
                <img
                  src={
                    !imageData ? "https://placehold.jp/40x40.png" : imageData
                  }
                  alt="avatar-img"
                  className="rounded-circle"
                  id="employeePicHeader"
                />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );

  return content;
};

export default DashHeader;
