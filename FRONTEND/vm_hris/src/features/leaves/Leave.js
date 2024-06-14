import React, { memo, useEffect, useState } from "react";
import {
  useUpdateLeaveMutation,
  useGetLeaveCreditsQuery,
} from "./leavesApiSlice";
import { Modal, Container, Row, Col, Form, Button } from "react-bootstrap";
import { format, parse } from "date-fns";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { OUTLET_EMAILS } from "../../config/outletEmailOptions";
import { useSendEmailMutation } from "../emailSender/sendEmailApiSlice";

const Leave = ({ leave, handleHover }) => {
  const { isX, branch } = useAuth();

  const { leaveCredit } = useGetLeaveCreditsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      leaveCredit: data?.ids
        .filter((id) => data.entities[id]?.CreditsOf?.id === leave.FiledFor?.id)
        .map((id) => data.entities[id])[0],
    }),
  });

  const [
    sendEmail,
    { isSuccess: emailSuccess, isError: emailError, error: emailerr },
  ] = useSendEmailMutation();

  const [updateLeave, { isSuccess: updateSuccess }] = useUpdateLeaveMutation();

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
      const result = await updateLeave({
        id: leave?.id,
        Approve: approveStat,
        Remarks: remarks,
      }).unwrap();

      // Send leave info to HR email if leave if filed from outlets/branches
      if (isX.isOutletProcessor) {
        const { _id, ...others } = result;

        let emailMsg = {
          email: OUTLET_EMAILS["Head Office"],
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

        sendEmail(emailMsg);
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
    let toastMsg = "Leave status updated";
    if (updateSuccess) {
      setLeaveFrom("");
      setLeaveUntil("");
      handleHover("");
      setRemarks("");
      setShowModal(false);

      // Double check if email has been sent (for Outlet Processors)
      if (isX.isOutletProcessor) {
        if (emailSuccess) {
          toastMsg = toastMsg + ", and been sent to HR";
        } else if (emailError) {
          toast.error("Email sending error. Contact administrator!");
          console.log(emailerr);
        }
      }

      toast.success(toastMsg, { containerId: "A" });
      toast.info("Page will refresh after 2 secs...", { containerId: "A" });

      const timeOutId = setTimeout(() => {
        window.location.reload();
      }, 2000);

      return () => clearTimeout(timeOutId);
    }
    // eslint-disable-next-line
  }, [updateSuccess]);

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

    return (
      <>
        <tr
          key={leave.id}
          onMouseOver={() => handleHover(leaveCredit)}
          onClick={() => {
            handleSetValues(leave);
            setShowModal(true);
          }}
        >
          <td>{`${leave?.FiledFor.FullName}`}</td>
          <td>{format(new Date(leave?.DateFiled), "PP")}</td>
          <td>{leave?.Lfrom}</td>
          <td>{leave?.Lto}</td>
          <td>{leave?.NoOfDays}</td>
          <td>{leave?.Ltype}</td>
          <td className={apprvTxtColor}>{approve}</td>
        </tr>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{`${leave.FiledFor?.LastName}'s ${leave?.Ltype}`}</Modal.Title>
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
                      Remarks {(isX.isProcessor || isX.isAdmin) && `(Optional)`}
                    </Form.Label>
                    {isX.isProcessor || isX.isAdmin ? (
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

          <>
            <Modal.Footer>
              {(isX.isAdmin || isX.isOutletProcessor || isX.isApprover) && (
                <>
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
                </>
              )}
              {isX.isUser && (
                <Button
                  type="button"
                  variant="outline-warning"
                  onClick={() => handleUpdateLeave(3)}
                >
                  Cancel
                </Button>
              )}
            </Modal.Footer>
          </>
        </Modal>
      </>
    );
  } else return null;
};

const memoizedLeave = memo(Leave);

export default memoizedLeave;
