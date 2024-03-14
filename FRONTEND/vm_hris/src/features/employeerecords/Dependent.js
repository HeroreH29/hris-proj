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
import useRecordForm from "../../hooks/useRecordForm";

const Dependent = ({
  dependent,
  isOutletProcessor,
  branch,
  sendEmail,
  generateEmailMsg,
}) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // eslint-disable-next-line
  const [updateDependent, { isLoading, isSuccess, isError }] =
    useUpdateDependentMutation();

  const [
    deleteDependent,
    // eslint-disable-next-line
    { isSuccess: isDelSuccess, isError: isDelError },
  ] = useDeleteDependentMutation();

  // Parse and format the birthday to make it editable through date input
  /* const parsFormBD = format(
    parse(dependent?.Birthday, "M/d/yyyy", new Date()),
    "yyyy-MM-dd"
  ); */

  /* VARIABLES */
  const { depState, depDispatch } = useRecordForm({ dependent });

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

  /* SUBMIT FUNCTION */
  const onSaveInfoClicked = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity() && !isLoading) {
      // Revert dates
      //const revertedBD = birthday ? dateRevert(birthday, "M/d/yyyy") : "";

      const { _id, __v, ...others } = depState;

      await updateDependent(others);

      if (isOutletProcessor) {
        await sendEmail(
          generateEmailMsg(
            branch,
            `${depState.EmployeeID}-Dependent.json`,
            depState.id,
            others,
            true
          )
        );
      }
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  /* DELETE FUNCTION */
  const onDeleteDependentClicked = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm(
      `Proceed deletion of "${depState.Names}"?`
    );
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
          <td>{depState.Names}</td>
          <td>{depState.Dependent}</td>
          <td>{format(new Date(depState.Birthday), "MMM dd, yyyy")}</td>
          <td>{depState.Status}</td>
          <td>
            {depState.Relationship === "Daugther"
              ? "Daughter"
              : depState.Relationship}
          </td>
          <td>{depState.Covered === 1 ? "Yes" : "No"}</td>
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
            <Modal.Title>{`Edit ${depState.Dependent} Dependent`}</Modal.Title>
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
                      depDispatch({
                        type: "birthday",
                        Birthday: e.target.value,
                      })
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
                    required
                    autoComplete="off"
                    type="text"
                    value={depState.Dependent}
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
