import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditGenInfoForm from "./EditGenInfoForm";

import {
  useGetDependentsQuery,
  useGetEducinfosQuery,
  useGetGeninfosQuery,
  useGetPersonalinfosQuery,
  useGetWorkinfosQuery,
} from "./recordsApiSlice";
import {
  Spinner,
  Tab,
  Tabs,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import EditPersonalInfoForm from "./EditPersonalInfoForm";
import DependentsList from "./DependentsList";
import WorkInfosList from "./WorkInfosList";
import EducInfoList from "./EducInfosList";

const EditRecord = () => {
  const { employeeId } = useParams();

  const navigate = useNavigate();

  // Fetch general info using Employee ID
  const { geninfo } = useGetGeninfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      geninfo: data?.ids
        .filter((id) => data.entities[id].EmployeeID.toString() === employeeId)
        .map((id) => data.entities[id])[0],
    }),
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Fetch personal info using Employee ID
  const { personalinfo } = useGetPersonalinfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      personalinfo: data?.ids
        .filter((id) => data.entities[id].EmployeeID.toString() === employeeId)
        .map((id) => data.entities[id])[0],
    }),
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Fetch dependents using EmployeeID
  const { dependents } = useGetDependentsQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      dependents: data?.ids
        .filter((id) => data?.entities[id].EmployeeID.toString() === employeeId)
        .map((id) => data?.entities[id]),
    }),
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Fetch educinfos using EmployeeID
  const { educinfos } = useGetEducinfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      educinfos: data?.ids
        .filter((id) => data?.entities[id].EmployeeID.toString() === employeeId)
        .map((id) => data?.entities[id]),
    }),
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Fetch workinfos using EmployeeID
  const { workinfos } = useGetWorkinfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      workinfos: data?.ids
        .filter((id) => data?.entities[id].EmployeeID.toString() === employeeId)
        .map((id) => data?.entities[id]),
    }),
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (!geninfo && !personalinfo && !dependents && !workinfos) {
    return <Spinner animation="border" />;
  }

  return (
    <Container>
      <Row className="mb-3">
        <Col md="auto">
          <Button
            variant="outline-secondary"
            onClick={() => navigate("/employeerecords")}
          >
            <FontAwesomeIcon icon={faLeftLong} />
          </Button>
        </Col>
        <Col md="auto">
          <h3>Edit Record</h3>
        </Col>
      </Row>
      <Tabs className="mb-3" defaultActiveKey="geninfo">
        <Tab eventKey="geninfo" title="General Info" unmountOnExit={true}>
          <EditGenInfoForm geninfo={geninfo} />
        </Tab>
        <Tab eventKey="personalinfo" title="Personal Info" unmountOnExit={true}>
          <EditPersonalInfoForm personalinfo={personalinfo} />
        </Tab>
        <Tab eventKey="dependents" title="Dependents" unmountOnExit={true}>
          <DependentsList dependents={dependents} employeeId={employeeId} />
        </Tab>
        <Tab
          eventKey="educinfo"
          title="Educational Attainment"
          unmountOnExit={true}
        >
          <EducInfoList educinfos={educinfos} employeeId={employeeId} />
        </Tab>
        <Tab
          eventKey="workinfo"
          title="Employment History"
          unmountOnExit={true}
        >
          <WorkInfosList workinfos={workinfos} employeeId={employeeId} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EditRecord;
