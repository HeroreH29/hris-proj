import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditGenInfoForm from "./EditGenInfoForm";

import {
  useGetGeninfosQuery,
  useGetPersonalinfosQuery,
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

const EditRecord = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  /*  const { geninfo } = useGetGeninfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      geninfo: data?.entities,
    }),
  }); */

  const {
    data: geninfos,
    isSuccess: genSuccess,
    isLoading: genLoading,
    isError: genError,
    error: gerror,
  } = useGetGeninfosQuery();

  const {
    data: personalinfos,
    isSuccess: persSuccess,
    isLoading: persLoading,
    isError: persError,
    error: perror,
  } = useGetPersonalinfosQuery();

  if (genLoading && persLoading) {
    return <Spinner animation="border" />;
  }

  if (genError && persError) {
    return (
      <p className="text-danger">
        geninfo err: {gerror?.data?.message} | persinfo err:{" "}
        {perror?.data?.message}
      </p>
    );
  }

  if (!genSuccess || !persSuccess) {
    return null; // or some default/fallback UI
  }

  const { ids: gids, entities: gentities } = geninfos;
  const { ids: pids, entities: pentities } = personalinfos;

  const geninfo = gids?.filter(
    (id) => gentities[id]?.EmployeeID === employeeId
  );

  const personalinfo = pids?.filter(
    (id) => pentities[id]?.EmployeeID === employeeId
  );

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
        <Tab eventKey="geninfo" title="General Info">
          <EditGenInfoForm geninfo={gentities[geninfo]} />
        </Tab>
        <Tab eventKey="personalinfo" title="Personal Info">
          <EditPersonalInfoForm personalinfo={pentities[personalinfo]} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default EditRecord;
