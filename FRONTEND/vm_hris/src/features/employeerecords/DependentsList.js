import React from "react";
import Dependent from "./Dependent";
import { Table, Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DependentsList = ({ dependents }) => {
  const tableContent = dependents?.length
    ? dependents.map((dep) => <Dependent dependent={dep} />)
    : null;

  return (
    <>
      <Container>
        <small>{`(Click a dependent to edit)`}</small>
        <Table
          responsive
          bordered
          striped
          hover
          className="align-middle ms-3 mt-3 mb-3"
        >
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Dependent</th>
              <th scope="col">Birthday</th>
              <th scope="col">Status</th>
              <th scope="col">Relationship</th>
              <th scope="col">Covered</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </Table>
      </Container>
    </>
  );
};

export default DependentsList;
