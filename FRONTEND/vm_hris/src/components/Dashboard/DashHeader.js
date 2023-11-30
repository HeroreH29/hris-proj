import React, { useState } from "react";
import { Link } from "react-router-dom";

const DashHeader = () => {
  const [imageData, setImageData] = useState("https://placehold.jp/40x40.png");
  return (
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
              <li className="nav-item">
                <a className="nav-link" href="/settings">
                  Settings
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/login"
                  /* onClick={() => userLogOut()} */
                >
                  Logout
                </a>
              </li>
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
};

export default DashHeader;
