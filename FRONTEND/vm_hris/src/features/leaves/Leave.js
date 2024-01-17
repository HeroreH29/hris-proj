import React, { memo, useState } from "react";
import { useGetLeavesQuery, useGetLeaveCreditsQuery } from "./leavesApiSlice";
import { useNavigate } from "react-router-dom";
import { Modal, Table } from "react-bootstrap";

const Leave = ({ leaveId }) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const { leave } = useGetLeavesQuery("leavesList", {
    selectFromResult: ({ data }) => ({
      leave: data?.entities[leaveId],
    }),
  });

  const [leaveCredit, setLeaveCredit] = useState("");

  const {
    data: leavecredits,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetLeaveCreditsQuery();

  const handleShowModal = () => {
    if (isSuccess && !isLoading && !isError) {
      const { ids, entities } = leavecredits;

      const leavecredit = ids?.length
        ? ids
            .filter((id) => {
              return entities[id]?.EmployeeID === leave?.EmployeeID;
            })
            .map((id) => entities[id])[0]
        : "";

      setLeaveCredit(leavecredit);
      setShowModal(true);
    }
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
        approve = "Declined";
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
        <tr key={leaveId} onClick={handleShowModal}>
          <td>{leave?.User}</td>
          <td>{leave?.DateOfFilling}</td>
          <td>{leave?.Lfrom}</td>
          <td>{leave?.Lto}</td>
          <td>{leave?.NoOfDays}</td>
          <td>{leave?.Ltype}</td>
          <td className={apprvTxtColor}>{approve}</td>
        </tr>

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {leave?.User}'s Leave Credits for {new Date().getFullYear()}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Used</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-semibold">Sick Leave</td>
                  <td>{leaveCredit?.SickLeave}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Vacation Leave</td>
                  <td>{leaveCredit?.VacationLeave}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Birthday Leave</td>
                  <td>{leaveCredit?.BirthdayLeave}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Maternity Leave</td>
                  <td>{leaveCredit?.MaternityLeave}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Paternity Leave</td>
                  <td>{leaveCredit?.PaternityLeave}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Matrimonial Leave</td>
                  <td>{leaveCredit?.MatrimonialLeave}</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Bereavement Leave</td>
                  <td>{leaveCredit?.BereavementLeave}</td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            {/* <p className="fst-italic">{`Author: ` + announcement.user}</p> */}
          </Modal.Footer>
        </Modal>
      </>
    );
  } else return null;
};

const memoizedLeave = memo(Leave);

export default memoizedLeave;
