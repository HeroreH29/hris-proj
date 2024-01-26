import React, { useState, memo, useEffect } from "react";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";
import { format, parse } from "date-fns";
import { STATUS, RELATIONSHIP, COVERED } from "../../config/depOptions";
import {
  useUpdateDependentMutation,
  useDeleteDependentMutation,
} from "./recordsApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dependent = ({ dependent }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // eslint-disable-next-line
  const [updateDependent, { isLoading, isSuccess, isError, error }] =
    useUpdateDependentMutation();

  const [
    deleteDependent,
    // eslint-disable-next-line
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteDependentMutation();

  // Parse and format the birthday to make it editable through date input
  const parsFormBD = format(
    parse(dependent?.Birthday, "M/d/yyyy", new Date()),
    "yyyy-MM-dd"
  );

  /* VARIABLES */
  const [names, setNames] = useState(dependent?.Names);
  const [dep, setDep] = useState(dependent?.Dependent);
  const [birthday, setBirthday] = useState(parsFormBD);
  const [status, setStatus] = useState(dependent?.Status);
  const [relationship, setRelationship] = useState(dependent?.Relationship);
  const [covered, setCovered] = useState(dependent?.Covered);

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

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setShowModal(false);
      setValidated(false);

      isSuccess && toast.info("Dependent information updated!");
      isDelSuccess && toast.info("Dependent successfully deleted!");

      navigate(`/employeerecords/${dependent?.EmployeeID}`);
    }
  }, [isSuccess, isDelSuccess, navigate, dependent?.EmployeeID]);

  /* DATE REVERT */
  const dateRevert = (dateString, formatString) => {
    return format(parse(dateString, "yyyy-MM-dd", new Date()), formatString);
  };

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() && !isLoading) {
      // Revert dates
      const revertedBD = birthday ? dateRevert(birthday, "M/d/yyyy") : "";

      await updateDependent({
        id: dependent.id,
        EmployeeID: dependent.EmployeeID,
        Names: names,
        Dependent: dep,
        Birthday: revertedBD,
        Relationship: relationship,
        Status: status,
        Covered: covered,
      });
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  /* DELETE FUNCTION */
  const onDeleteDependentClicked = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm(`Proceed deletion of "${names}"?`);
    if (isConfirmed) {
      await deleteDependent({ id: dependent.id });
    } else {
      console.log("Deletion cancelled");
    }
  };

  const [validated, setValidated] = useState(false);

  if (dependent) {
    return (
      <>
        <tr
          onClick={() => {
            setShowModal(true);
          }}
        >
          <td>{names}</td>
          <td>{dep}</td>
          <td>{dependent.Birthday}</td>
          <td>{status}</td>
          <td>{relationship === "Daugther" ? "Daughter" : relationship}</td>
          <td>{covered}</td>
        </tr>

        {/* View edit dependent modal */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title>{`Edit ${dep} Dependent`}</Modal.Title>
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
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
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
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
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
                    required
                    autoComplete="off"
                    type="text"
                    value={dep}
                    onChange={(e) => setDep(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    This field is required!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="mb-3">
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
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
                      relationship === "Daugther" ? "Daughter" : relationship
                    }
                    onChange={(e) => setRelationship(e.target.value)}
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
                    value={covered}
                    onChange={(e) => setCovered(e.target.value)}
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
                    Save Changes
                  </Button>
                </Col>
                <Col md="auto">
                  {/* Enable if dependent deletion is required */}
                  <Button
                    disabled
                    type="button"
                    onClick={onDeleteDependentClicked}
                    variant="outline-danger"
                  >
                    Delete Dependent
                  </Button>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  } else return null;
};

const memoizedDependent = memo(Dependent);

export default memoizedDependent;
