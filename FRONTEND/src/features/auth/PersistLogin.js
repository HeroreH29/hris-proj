import { Outlet, Link } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";

import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { Spinner } from "react-bootstrap";
import { useRefreshMutation } from "../../app/api/slices/authApiSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  // eslint-disable-next-line
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
        try {
          await refresh();
          setTrueSuccess(true);
        } catch (error) {
          console.log(error);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    //eslint-disable-next-line
  }, []);

  let content;

  /* Check if user trusts the current device */
  if (!persist) {
    console.log("no persist"); // User does not trust device. Will force redirect eh user to login page
    content = <Outlet />;
  } else if (isLoading) {
    console.log("loading");
    content = <Spinner animation="border" />;
  } else if (isError) {
    console.log("error");
    content = (
      <p>
        Some error occured...<Link to={"/"}>Please login again</Link>
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    console.log("token and uninit");
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
