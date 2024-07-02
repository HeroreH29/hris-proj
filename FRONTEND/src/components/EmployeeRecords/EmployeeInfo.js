import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllEmployeeInfosQuery } from "../../app/api/slices/employeeInfoApiSlice";
import {
  Spinner,
  Container,
  Row,
  Col,
  Button,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import useTitle from "../../hooks/useTitle";
import GenInfo from "./Infos/GenInfo";
import PersonalInfo from "./Infos/PersonalInfo";

const EmployeeInfo = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  useTitle("Employee Records | HRIS Project");

  const { einfo } = useGetAllEmployeeInfosQuery(undefined, {
    selectFromResult: ({ data }) => ({
      einfo: data?.ids
        .filter((id) => data?.entities[id].EmployeeID.toString() === employeeId)
        .map((id) => data.entities[id])[0],
    }),
  });

  const [empInfo, setEmpInfo] = useState(einfo);

  if (!empInfo) return <Spinner animation="border" />;

  return (
    <Container>
      <Row>
        <Col md="auto">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/employeerecords")}
          >
            <FontAwesomeIcon icon={faLeftLong} />
          </Button>
        </Col>
        <Col>
          <h3>{einfo ? `${einfo.GenInfo.LastName}'s Info` : "Add Employee"}</h3>
        </Col>
        <Col md="auto">
          <Button variant="outline-success" size="sm">
            <span className="me-2">Send info to outlet</span>
            <FontAwesomeIcon icon={faEnvelope} />
          </Button>
        </Col>
      </Row>
      <Tabs
        className="p-3 mb-3"
        defaultActiveKey={employeeId ? "" : "geninfo"}
        justify
      >
        <Tab eventKey={"geninfo"} title="General Info" unmountOnExit={true}>
          <GenInfo get={empInfo} set={setEmpInfo} />
        </Tab>
        <Tab
          eventKey={"personalinfo"}
          title="Personal Info"
          unmountOnExit={true}
        >
          <PersonalInfo />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EmployeeInfo;
