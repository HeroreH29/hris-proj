import React, { memo, useEffect, useState } from "react";
import {
  useGetLeavesQuery,
  useUpdateLeaveMutation,
  useUpdateLeaveCreditMutation,
  useSendLeaveThruEmailMutation,
} from "./leavesApiSlice";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import { useNavigate } from "react-router-dom";
import { Modal, Container, Row, Col, Form, Button } from "react-bootstrap";
import { format, parse } from "date-fns";
import useAuth from "../../hooks/useAuth";

const Leave = ({ leaveId, handleHover, leaveCredit }) => {
  const { branch, isHR, isAdmin, isOutletProcessor } = useAuth();
  const navigate = useNavigate();

  const [
    sendLeaveThruEmail,
    { isSuccess: emailSuccess, isError: emailError, error: emailerr },
  ] = useSendLeaveThruEmailMutation();

  const { leave } = useGetLeavesQuery("leavesList", {
    selectFromResult: ({ data }) => ({
      leave: data?.entities[leaveId],
    }),
  });

  const { data: geninfos } = useGetGeninfosQuery();

  const [updateLeave, { isSuccess: updateSuccess }] = useUpdateLeaveMutation();

  const [updateLeaveCredit, { isSuccess: creditUpdateSuccess }] =
    useUpdateLeaveCreditMutation();

  const [showModal, setShowModal] = useState(false);

  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveUntil, setLeaveUntil] = useState("");
  const [remarks, setRemarks] = useState("");
  const [leaveStatus, setLeaveStatus] = useState(leave && leave?.Approve);

  const handleUpdateLeave = async (approveStat) => {
    const confirm = window.confirm(
      `${
        approveStat === 1
          ? "APPROVE"
          : approveStat === 2
          ? "DISAPPROVE"
          : approveStat === 3
          ? "CANCEL"
          : ""
      } this leave?`
    );

    if (confirm) {
      // Update leave
      try {
        const payload = await updateLeave({
          id: leave?.id,
          Approve: approveStat,
          Remarks: remarks,
        }).unwrap();

        // Send leave information thru email
        if (isOutletProcessor) {
          const { _id, __v, ...others } = payload;

          let emailMsg = {
            email: "hero.viamare@gmail.com",
            subject: `${branch} Leave Application for Filing`,
            message: `Good day,\n\nThis email contains an employee leave application from '${branch}'.\nKindly upload the attached file to your system.\n\n\n*PLEASE DO NOT REPLY TO THIS EMAIL*`,
            attachments: [
              {
                filename: `${leave?.EmployeeID}-FiledLeave.json`,
                content: JSON.stringify(others),
                contentType: "application/json",
              },
            ],
          };

          await sendLeaveThruEmail(emailMsg);
        }

        setLeaveStatus(approveStat);
      } catch (error) {
        alert(`Something went wrong: ${error}`);
      }

      // Check first if leave is being approved. Then proceed in credit deduction if necessary
      if (approveStat === 1) {
        // Update leave credit of employee
        const ltype = leave?.Ltype.replace(" ", "");
        const noOfCreditsToDeduct = leaveCredit?.[ltype] - leave?.NoOfDays;

        const updatedLeaveCredit = {
          id: leaveCredit?.id,
          [ltype]: noOfCreditsToDeduct >= 0 ? noOfCreditsToDeduct : 0,
        };
        try {
          await updateLeaveCredit(updatedLeaveCredit);
        } catch (error) {
          alert(`Something went wrong: ${error}`);
        }
      }
    }
  };

  const handleSetValues = (leave) => {
    setLeaveFrom(
      format(parse(leave?.Lfrom, "MMM dd, yyyy", new Date()), "yyyy-MM-dd")
    );
    setLeaveUntil(
      format(parse(leave?.Lto, "MMM dd, yyyy", new Date()), "yyyy-MM-dd")
    );
  };

  useEffect(() => {
    if (updateSuccess || creditUpdateSuccess || emailSuccess) {
      setLeaveFrom("");
      setLeaveUntil("");
      handleHover("");
      setRemarks("");
      setShowModal(false);

      navigate("/leaves");
    }
    // eslint-disable-next-line
  }, [updateSuccess, creditUpdateSuccess, emailSuccess, navigate]);

  if (leave) {
    let approve;
    let apprvTxtColor;
    switch (leave?.Approve || leaveStatus) {
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
            <Modal.Title>{`${entities[foundRecord]?.LastName}'s ${leave?.Ltype}`}</Modal.Title>
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
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label className="fw-semibold">
                      Remarks {(isHR || isAdmin) && `(Optional)`}
                    </Form.Label>
                    {isHR || isAdmin ? (
                      <>
                        <Form.Control
                          disabled={leave?.Approve !== 0}
                          as={"textarea"}
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </>
                    ) : (
                      <>
                        <Form.Control
                          disabled
                          as={"textarea"}
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </>
                    )}
                  </Form.Group>
                </Row>
              </Form>
            </Container>
          </Modal.Body>
          {isHR ||
            (isAdmin && (
              <>
                <Modal.Footer>
                  <Button
                    disabled={leave?.Approve !== 0}
                    type="button"
                    variant="outline-success"
                    onClick={() => handleUpdateLeave(1)}
                  >
                    Approve
                  </Button>
                  <Button
                    disabled={leave?.Approve !== 0}
                    type="button"
                    variant="outline-danger"
                    onClick={() => handleUpdateLeave(2)}
                  >
                    Disapprove
                  </Button>
                  <Button
                    disabled={leave?.Approve !== 0}
                    type="button"
                    variant="outline-warning"
                    onClick={() => handleUpdateLeave(3)}
                  >
                    Cancel
                  </Button>
                </Modal.Footer>
              </>
            ))}
        </Modal>
      </>
    );
  } else return null;
};

const memoizedLeave = memo(Leave);

export default memoizedLeave;
