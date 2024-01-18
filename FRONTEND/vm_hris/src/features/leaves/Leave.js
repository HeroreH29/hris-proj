import React, { memo, useState } from "react";
import { useGetLeavesQuery, useUpdateLeaveMutation } from "./leavesApiSlice";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import { useNavigate } from "react-router-dom";
import { Modal, Container, Row, Col, Form, Button } from "react-bootstrap";
import { format, parse } from "date-fns";

const Leave = ({ leaveId, handleHover }) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveUntil, setLeaveUntil] = useState("");

  const {
    data: geninfos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetGeninfosQuery();

  const [
    updateLeave,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateLeaveMutation();

  const { leave } = useGetLeavesQuery("leavesList", {
    selectFromResult: ({ data }) => ({
      leave: data?.entities[leaveId],
    }),
  });

  const handleUpdateLeave = (approveStat) => {
    console.log(approveStat);
  };

  const handleSetValues = (leave) => {
    setLeaveFrom(
      format(parse(leave?.Lfrom, "MMM dd, yyyy", new Date()), "yyyy-MM-dd")
    );
    setLeaveUntil(
      format(parse(leave?.Lto, "MMM dd, yyyy", new Date()), "yyyy-MM-dd")
    );
  };

  if (leave) {
    let approve;
    let apprvTxtColor;
    switch (leave?.Approve) {
      case 1:
        approve = "Approved";
        apprvTxtColor = "fw-semibold text-success";
        break;
      case 2:
        approve = "Disapproved";
        apprvTxtColor = "fw-semibold text-danger";
        break;
      case 3:
        approve = "Cancelled";
        apprvTxtColor = "fw-semibold text-warning";
        break;

      default:
        approve = "Pending";
        apprvTxtColor = "fw-semibold text-primary";
        break;
    }

    // Get the actual name of the employee based on obtained EmployeeID
    const { ids, entities } = geninfos;

    const foundRecord = ids?.length
      ? ids
          .filter((id) => entities[id]?.EmployeeID === leave?.EmployeeID)
          .map((id) => id)
      : null;

    return (
      <>
        <tr
          key={leaveId}
          onMouseEnter={() => handleHover(leave?.EmployeeID)}
          onMouseLeave={() => handleHover("")}
          onClick={() => {
            handleSetValues(leave);
            setShowModal(true);
          }}
        >
          <td>{`${entities[foundRecord]?.LastName}, ${entities[foundRecord]?.FirstName} ${entities[foundRecord]?.MI}.`}</td>
          <td>{leave?.DateOfFilling}</td>
          <td>{leave?.Lfrom}</td>
          <td>{leave?.Lto}</td>
          <td>{leave?.NoOfDays}</td>
          <td>{leave?.Ltype}</td>
          <td className={apprvTxtColor}>{approve}</td>
        </tr>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{`${entities[foundRecord]?.LastName}, ${entities[foundRecord]?.FirstName} ${entities[foundRecord]?.MI}.'s Filed Leave`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Form>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label className="fw-semibold">Reason</Form.Label>
                    <Form.Control
                      as={"textarea"}
                      disabled
                      defaultValue={leave?.Reason}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label className="fw-semibold">Leave From</Form.Label>
                    <Form.Control
                      disabled
                      type="date"
                      defaultValue={leaveFrom}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label className="fw-semibold">Leave Until</Form.Label>
                    <Form.Control
                      disabled
                      type="date"
                      defaultValue={leaveUntil}
                    />
                  </Form.Group>
                </Row>
              </Form>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              variant="outline-success"
              onClick={() => handleUpdateLeave(1)}
            >
              Approve
            </Button>
            <Button
              type="button"
              variant="outline-danger"
              onClick={() => handleUpdateLeave(2)}
            >
              Disapprove
            </Button>
            <Button
              type="button"
              variant="outline-warning"
              onClick={() => handleUpdateLeave(3)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  } else return null;
};

const memoizedLeave = memo(Leave);

export default memoizedLeave;
