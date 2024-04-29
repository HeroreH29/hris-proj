import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import TrainingHistory from "./TrainingHistory";
import TrainingHistoryModal from "../../modals/TrainingHistoryModal";

const TrainingHistoryList = ({ trainingHistories = [] }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const tableContent = trainingHistories?.length
    ? trainingHistories
        .sort((a, b) => {
          return b.TrainingDate - a.TrainingDate;
        })
        .map((trainingHistory, index) => (
          <TrainingHistory key={index} trainingHistory={trainingHistory} />
        ))
    : null;
  return (
    <>
      <Container>
        <Row>
          <Col>
            <Button
              className="float-end"
              type="button"
              variant="outline-primary"
              onClick={() => setShow(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Col>
        </Row>
        <Table bordered striped hover className="align-middle ms-3 mt-3 mb-3">
          <thead>
            <tr>
              <th scope="col">Training Course</th>
              <th scope="col">Date</th>
              <th scope="col">Remarks</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </Table>
      </Container>

      {/* View add training history modal */}
      <TrainingHistoryModal handleClose={handleClose} newHistory show={show} />
    </>
  );
};

export default TrainingHistoryList;
