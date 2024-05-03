import React, { useEffect, useState } from "react";
import { Modal, Form, Stack, Button } from "react-bootstrap";
import {
  useAddTrainingHistoryMutation,
  useUpdateTrainingHistoryMutation,
  useDeleteTrainingHistoryMutation,
} from "../features/employeerecords/recordsApiSlice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const TrainingHistoryModal = ({
  newHistory = true,
  trainingData = { TrainingCourse: "", TrainingDate: "", Remarks: "" },
  show = false,
  handleClose = undefined,
}) => {
  const { employeeId } = useParams();

  const [addTrainingHistory, { error: adderr }] =
    useAddTrainingHistoryMutation();
  const [updateTrainingHistory, { error: updateerr }] =
    useUpdateTrainingHistoryMutation();
  const [deleteTrainingHistory, { error: deleteerr }] =
    useDeleteTrainingHistoryMutation();

  const [trainingCourse, setTrainingCourse] = useState("");
  const [trainingDate, setTrainingDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [validated, setValidated] = useState(false);

  // Update state when newHistory changes
  useEffect(() => {
    if (!newHistory) {
      setTrainingCourse(trainingData.TrainingCourse);
      setTrainingDate(trainingData.TrainingDate);
      setRemarks(trainingData.Remarks);
    } else {
      setTrainingCourse("");
      setTrainingDate("");
      setRemarks("");
    }
  }, [trainingData, newHistory]);

  // Submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTrainingData = {
      TrainingCourse: trainingCourse,
      TrainingDate: trainingDate,
      Remarks: remarks,
      EmployeeID: employeeId,
    };

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (newHistory) {
      toast.promise(() => addTrainingHistory(newTrainingData), {
        pending: "Adding training history...",
        success: "Training history added!",
        error: adderr,
      });
    } else {
      toast.promise(
        updateTrainingHistory({ ...trainingData, ...newTrainingData }),
        {
          pending: "Updating training history...",
          success: "Training history updated!",
          error: updateerr,
        }
      );
    }

    window.location.reload();
  };

  // Delete function
  const handleDelete = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm("Are you sure you want to delete this?");
    if (!isConfirmed) return;

    toast.promise(deleteTrainingHistory(trainingData), {
      pending: "Deleting training history...",
      success: "Training history deleted!",
      error: deleteerr,
    });

    window.location.reload();
  };

  const trainingHistoryForm = (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {newHistory ? "New Training History" : "Edit Training History"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated}>
          <Stack gap={3}>
            <Form.Group>
              <Form.Label className="fw-semibold">Training Course</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="Enter course name..."
                value={trainingCourse}
                onChange={(e) => setTrainingCourse(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Required field!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Training Date</Form.Label>
              <Form.Control
                required
                type="date"
                value={trainingDate}
                onChange={(e) => setTrainingDate(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Required field!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">
                {"Remarks (Optional)"}
              </Form.Label>
              <Form.Control
                as={"textarea"}
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>
          </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Stack direction="horizontal" gap={2}>
          {!newHistory && (
            <Button variant="outline-danger" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          )}
          <Button variant="outline-warning" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline-success"
            onClick={handleSubmit}
          >
            Proceed
          </Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );

  return trainingHistoryForm;
};

export default TrainingHistoryModal;
