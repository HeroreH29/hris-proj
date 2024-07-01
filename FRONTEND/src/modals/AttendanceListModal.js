import React from "react";
import { Modal, Button, ListGroup, Stack } from "react-bootstrap";

const AttendanceListModal = ({
  attModalState,
  attModalDispatch,
  attdata,
  setAttlogData,
  handleAttlistRefresh,
}) => {
  const { ids, entities } = attdata;
  return (
    <Modal
      show={attModalState?.showListModal}
      onHide={() => {
        attModalDispatch({ type: "close_list_modal" });
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Uploaded Attendance List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <strong>Select an attendance data to show:</strong>
        <ListGroup>
          {ids
            .map((id, index) => (
              <ListGroup.Item
                action
                onClick={() => handleAttlistRefresh(entities[id].data)}
                key={index}
              >
                <Stack gap={2}>
                  <span className="p-2 fw-semibold">
                    {entities[id].attlogName}
                  </span>
                  <small className="p-2">{entities[id].uploadedAt}</small>
                </Stack>
              </ListGroup.Item>
            ))
            .reverse()}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default AttendanceListModal;
