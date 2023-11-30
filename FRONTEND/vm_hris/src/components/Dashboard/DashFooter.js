import React, { useState, useEffect } from "react";

const DashFooter = () => {
  const date = new Date();
  const [currentTime, setCurrentTime] = useState(new Date());

  /* Extract month, day, and year */
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

  return (
    <div className="fixed-sm-bottom">
      <footer className="footer bg-body-secondary">
        <div className="container">
          <strong>DATE:</strong> {`${month} ${day}, ${year}`} |
          <strong> TIME:</strong>
          {` ${twelveHourFormat}:${minutes}:${seconds}`} {ampm}
        </div>
      </footer>
    </div>
  );
};

export default DashFooter;
