import React, { useState } from "react";
import { Modal, Form, Stack, Button } from "react-bootstrap";

const TrainingHistoryModal = ({
  newHistory = true,
  trainingHistory = {},
  show = false,
  handleClose = undefined,
}) => {
  const [trainingCourse, setTrainingCourse] = useState("");
  const [trainingDate, setTrainingDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const newTrainingHistory = (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Training History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Stack gap={3}>
            <Form.Group>
              <Form.Label className="fw-semibold">Training Course</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course name..."
                value={trainingCourse}
                onChange={(e) => setTrainingCourse(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-semibold">Training Date</Form.Label>
              <Form.Control
                type="date"
                value={trainingDate}
                onChange={(e) => setTrainingDate(e.target.value)}
              />
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
          <Button variant="outline-warning">Cancel</Button>
          <Button variant="outline-success">Proceed</Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );

  const editTrainingHistory = (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Training History</Modal.Title>
      </Modal.Header>
      <Modal.Body>Edit</Modal.Body>
    </Modal>
  );

  return newHistory ? newTrainingHistory : editTrainingHistory;
};

export default TrainingHistoryModal;
