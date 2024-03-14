import React, { useState, useEffect } from "react";
import Dependent from "./Dependent";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { format, parse } from "date-fns";
import { useAddDependentMutation } from "./recordsApiSlice";
import { STATUS, RELATIONSHIP, COVERED } from "../../config/depOptions";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { generateEmailMsg } from "../emailSender/generateEmailMsg";
import { useSendEmailMutation } from "../emailSender/sendEmailApiSlice";
import useRecordForm from "../../hooks/useRecordForm";

const DependentsList = ({ dependents, employeeId }) => {
  const { isOutletProcessor, branch } = useAuth();

  /* const [deps, setDeps] = useState([]);

  useEffect(() => {
    setDeps(dependents);
    // eslint-disable-next-line
  }, []); */

  // eslint-disable-next-line
  const [addDependent, { isLoading, isSuccess, isError, error }] =
    useAddDependentMutation();

  const [sendEmail] = useSendEmailMutation();

  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);

  /* VARIABLES */
  const { depState, depDispatch } = useRecordForm({});
  const [names, setNames] = useState("");
  const [dep, setDep] = useState("");
  const [birthday, setBirthday] = useState("");
  const [status, setStatus] = useState("");
  const [relationship, setRelationship] = useState("");
  const [covered, setCovered] = useState("");

  /* DATE REVERT */
  const dateRevert = (dateString, formatString) => {
    return format(parse(dateString, "yyyy-MM-dd", new Date()), formatString);
  };

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    // Revert dates
    //const revertedBD = birthday ? dateRevert(birthday, "M/d/yyyy") : "";

    let dependentData = { EmployeeID: employeeId, ...depState };

    if (form.checkValidity() && !isLoading) {
      await addDependent(dependentData);

      /* setDeps((prev) => [...prev, dependentData]); */

      if (isOutletProcessor) {
        await sendEmail(
          generateEmailMsg(
            branch,
            `${employeeId}-Dependent.json`,
            "",
            dependentData
          )
        );
      }
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  /* DROPDOWN OPTIONS */
  const statusOptions = Object.entries(STATUS).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });
  const relationshipOptions = Object.entries(RELATIONSHIP).map(
    ([key, value]) => {
      return (
        <option key={key} value={value}>
          {key}
        </option>
      );
    }
  );
  const coveredOptions = Object.entries(COVERED).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });

  const tableContent = dependents?.length
    ? dependents
        .sort((a, b) => new Date(a.Birthday) - new Date(b.Birthday))
        .map((dep, index) => (
          <Dependent
            key={index}
            dependent={dep}
            isOutletProcessor={isOutletProcessor}
            branch={branch}
            sendEmail={sendEmail}
            generateEmailMsg={generateEmailMsg}
          />
        ))
    : null;

  useEffect(() => {
    if (isSuccess) {
      setNames("");
      setDep("");
      setBirthday("");
      setStatus("");
      setRelationship("");
      setCovered("");
      setShowModal(false);
      setValidated(false);

      toast.success("Dependent successfully addded!");
    }
  }, [isSuccess]);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <small>{`(Click a dependent to edit)`}</small>
          </Col>
          <Col>
            <Button
              className="float-end"
              type="button"
              variant="outline-primary"
              onClick={() => setShowModal(true)}
            >
              <FontAwesomeIcon icon={faPersonCirclePlus} />
            </Button>
          </Col>
        </Row>
        <Table bordered striped hover className="align-middle ms-3 mt-3 mb-3">
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

      {/* View add dependent modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Dependent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={onSaveInfoClicked}>
            {/* Name and Birthday */}
            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3">
                <Form.Label className="fw-semibold">Name</Form.Label>
                <Form.Control
                  required
                  autoFocus
                  autoComplete="off"
                  type="text"
                  value={depState.Names}
                  onChange={(e) =>
                    depDispatch({ type: "names", Names: e.target.value })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} className="mb-3">
                <Form.Label className="fw-semibold">Birthday</Form.Label>
                <Form.Control
                  required
                  type="date"
                  value={depState.Birthday}
                  onChange={(e) =>
                    depDispatch({ type: "birthday", Birthday: e.target.value })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            {/* Dependent and Status */}
            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3">
                <Form.Label className="fw-semibold">Dependent</Form.Label>
                <Form.Control
                  disabled={
                    depState.Relationship === "Mother" ||
                    depState.Relationship === "Father"
                  }
                  autoComplete="off"
                  type="text"
                  value={depState.Dependent}
                  placeholder="e.g. 1st/2nd/3rd/etc..."
                  onChange={(e) =>
                    depDispatch({
                      type: "dependent",
                      Dependent: e.target.value,
                    })
                  }
                />
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} className="mb-3">
                <Form.Label className="fw-semibold">Status</Form.Label>
                <Form.Select
                  required
                  value={depState.Status}
                  onChange={(e) =>
                    depDispatch({ type: "status", Status: e.target.value })
                  }
                >
                  {statusOptions}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            {/* Relationship and Covered */}
            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3">
                <Form.Label className="fw-semibold">Relationship</Form.Label>
                <Form.Select
                  required
                  value={
                    depState.Relationship === "Daugther"
                      ? "Daughter"
                      : depState.Relationship
                  }
                  onChange={(e) =>
                    depDispatch({
                      type: "relationship",
                      Relationship: e.target.value,
                    })
                  }
                >
                  {relationshipOptions}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} className="mb-3">
                <Form.Label className="fw-semibold">Covered</Form.Label>
                <Form.Select
                  required
                  value={depState.Covered}
                  onChange={(e) =>
                    depDispatch({ type: "covered", Covered: e.target.value })
                  }
                >
                  {coveredOptions}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  This field is required!
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3 float-end">
              <Col md="auto">
                <Button type="submit" variant="outline-success">
                  Add Dependent
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DependentsList;
