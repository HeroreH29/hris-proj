import { Outlet, Link } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

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
  if (!persist) {
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    console.log("loading");
    content = <p>Loading...</p>;
  } else if (isError) {
    console.log("error");
    content = (
      <p>
        Some error occured...<Link to={"/"}>Please login again</Link>
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    console.log("succcess");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    console.log("token and uninit");
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
