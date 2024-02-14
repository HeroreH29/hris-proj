import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Container } from "react-bootstrap";

const DashFooter = () => {
  const { username, status, branch } = useAuth();

  const date = new Date();
  const [currentTime, setCurrentTime] = useState(new Date());

  /* Extract month, day, and year */
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  /* Extract hours, minutes, and seconds */
  const hours = String(currentTime.getHours()).padStart(2, "0");
  const minutes = String(currentTime.getMinutes()).padStart(2, "0");
  const seconds = String(currentTime.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const twelveHourFormat = hours % 12 || 12;

  const content = (
    <div id="dashfooter" className="sticky-bottom">
      <footer className="footer bg-body-secondary">
        <Container>
          <strong>DATE:</strong> <span className="fw-semibold">{dayName}</span>
          {` - ${month} ${day}, ${year} | `}
          <strong> TIME:</strong>
          {` ${twelveHourFormat}:${minutes}:${seconds} ${ampm} | `}
          <strong> BRANCH:</strong> {`${branch} | `}
          <strong> CURRENT USER:</strong> {`${username} | `}
          <strong> USER LEVEL:</strong> {status}
        </Container>
      </footer>
    </div>
  );
  return content;
};

export default DashFooter;
