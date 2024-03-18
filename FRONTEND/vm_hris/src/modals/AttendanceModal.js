import React from "react";
import { Col, Button, Form, Modal, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const AttendanceModal = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setValidated,
  state,
  validated,
  handlePrintBranchAttendance,
  handlePrintAtt,
  geninfo,
  dateFrom,
  dateTo,
  attModalState,
  attModalDispatch,
  tableState,
  tableDispatch,
  tableContent,
  filteredAtt = null,
  att = null,
  matchingAtt = null,
}) => {
  const ByBranchPrintModal = (
    <Modal
      show={attModalState.showModal}
      onHide={() => {
        attModalDispatch({ type: "close_modal" });
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{`Print ${tableState.outletFilter} (${tableState.empTypeFilter}) Attendance`}</Modal.Title>
      </Modal.Header>
      <Form
        noValidate
        validated={validated}
        onSubmit={handlePrintBranchAttendance}
      >
        <Modal.Body>
          <Form.Group className="mb-2" as={Col}>
            <Form.Label className="fw-semibold">Date from:</Form.Label>
            <Form.Control
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Choose a date
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-2" as={Col}>
            <Form.Label className="fw-semibold">Date until:</Form.Label>
            <Form.Control
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Choose a date
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-warning"
            onClick={() => attModalDispatch({ type: "close_modal" })}
          >
            Cancel
          </Button>
          <Button variant="outline-success" type="submit">
            Proceed
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );

  const ByEmployeePrintModal = (
    <Modal
      show={attModalState.showModal}
      onHide={() => attModalDispatch({ type: "close_modal" })}
      scrollable
      size="lg"
    >
      <Modal.Header closeButton>
        {filteredAtt.name}'s Attendance{" "}
        <span className="ms-1 fw-semibold">{` (${geninfo?.EmployeeType})`}</span>{" "}
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <caption>{`(Pick date range before proceeding in printing)`}</caption>
          <thead>
            <tr className="align-middle">
              <th>Date</th>
              <th>Time-In</th>
              <th>Break-In</th>
              <th>Break-Out</th>
              <th>Time-Out</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
          <tfoot>
            <tr>
              <td className="fw-bold" colSpan={1}>
                Filter by Date:
              </td>
              <td colSpan={2}>
                <Form>
                  <Form.Group>
                    <Form.Label className="fw-bold">Date From</Form.Label>
                    <Form.Control
                      type="date"
                      value={attModalState.dateFrom}
                      onChange={(e) =>
                        attModalDispatch({
                          type: "date_from",
                          dateFrom: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Form>
              </td>
              <td colSpan={2}>
                <Form>
                  <Form.Group>
                    <Form.Label className="fw-bold">Date To</Form.Label>
                    <Form.Control
                      type="date"
                      value={attModalState.dateTo}
                      onChange={(e) =>
                        attModalDispatch({
                          type: "date_to",
                          dateTo: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Form>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-primary"
          onClick={handlePrintAtt}
          disabled={dateTo === "" || dateFrom === ""}
        >
          <FontAwesomeIcon icon={faPrint} />
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => {
            tableDispatch({ type: "slice_dec" });
          }}
          disabled={tableState.sliceStart === 0}
        >
          Prev
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => {
            tableDispatch({ type: "slice_inc" });
          }}
          disabled={
            filteredAtt?.length
              ? tableState.sliceEnd >= filteredAtt?.length
              : tableState.sliceEnd >= matchingAtt?.length
          }
        >
          Next
        </Button>
      </Modal.Footer>
    </Modal>
  );
  return !filteredAtt && !att ? ByBranchPrintModal : ByEmployeePrintModal;
};

export default AttendanceModal;
