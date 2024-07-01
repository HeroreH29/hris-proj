import React from "react";
import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";
import { Container } from "react-bootstrap";

const DashLayout = () => {
  return (
    <>
      <DashHeader />
      <Container id="content" className="p-4">
        <Outlet />
      </Container>
      <DashFooter />
    </>
  );
};

export default DashLayout;
