import React, { memo, useEffect, useState } from "react";
import {
  useUpdateLeaveMutation,
  useUpdateLeaveCreditMutation,
  useGetLeaveCreditsQuery,
} from "./leavesApiSlice";
import { useNavigate } from "react-router-dom";
import { Modal, Container, Row, Col, Form, Button } from "react-bootstrap";
import { format, parse } from "date-fns";
import useAuth from "../../hooks/useAuth";
import { useSendEmailMutation } from "../emailSender/sendEmailApiSlice";
import { toast } from "react-toastify";

const Leave = ({ leave, handleHover }) => {
  const { branch, isHR, isAdmin, isOutletProcessor } = useAuth();
  const navigate = useNavigate();

  const { leaveCredit } = useGetLeaveCreditsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      leaveCredit: data?.ids
        .filter((id) => data.entities[id].CreditsOf._id === leave.FiledFor._id)
        .map((id) => data.entities[id])[0],
    }),
  });

  const [sendEmail, { isSuccess: emailSuccess }] = useSendEmailMutation();

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

        // Send leave information to HR email if leave is filed from outlets/branches
        if (isOutletProcessor) {
          const { _id, ...others } = payload;

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

          sendEmail(emailMsg);
        }

        setLeaveStatus(approveStat);
      } catch (error) {
        alert(`Something went wrong: ${error}`);
      }

      // Check first if leave is being approved. Then proceed in credit deduction if necessary
      if (approveStat === 1) {
        // Update leave credit of employee
        const ltype = leave?.Ltype.replace(" ", "");
        const deductedCredit = leaveCredit?.[ltype] - leave?.NoOfDays;

        const updatedLeaveCredit = {
          id: leaveCredit?.id,
          [ltype]: deductedCredit >= 0 ? deductedCredit : 0,
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
      if (isAdmin || isHR) {
        toast.success("Leave status updated");
      } else if (isOutletProcessor) {
        toast.success("Leave status updated and sent to HR email");
      }

      navigate("/leaves");
    }
    // eslint-disable-next-line
  }, [updateSuccess, creditUpdateSuccess, navigate]);

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
          <td>{`${leave?.FiledFor?.GenInfo.FullName}`}</td>
          <td>{format(new Date(leave?.DateFiled), "PP")}</td>
          <td>{leave?.Lfrom}</td>
          <td>{leave?.Lto}</td>
          <td>{leave?.NoOfDays}</td>
          <td>{leave?.Ltype}</td>
          <td className={apprvTxtColor}>{approve}</td>
        </tr>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{`${leave.FiledFor?.GenInfo.LastName}'s ${leave?.Ltype}`}</Modal.Title>
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
          {isHR || isOutletProcessor || isAdmin ? (
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
          ) : (
            <></>
          )}
        </Modal>
      </>
    );
  } else return null;
};

const memoizedLeave = memo(Leave);

export default memoizedLeave;
