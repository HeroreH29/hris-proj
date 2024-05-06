import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Spinner,
  Form,
  Stack,
  OverlayTrigger,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faLevelUp } from "@fortawesome/free-solid-svg-icons";
import { useGetLeavesQuery } from "./leavesApiSlice";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import Leave from "./Leave";
import useAuth from "../../hooks/useAuth";
import useTableSettings from "../../hooks/useTableSettings";
import TooltipRenderer from "../../xtra_functions/TooltipRenderer";
import { ASSIGNEDOUTLET } from "../../config/gInfoOptions";
import PrintLeave from "./PrintLeave";

const LeavesList = () => {
  useTitle("Leaves | Via Mare HRIS");

  const {
    userLevel,
    employeeId,
    isUser,
    isOutletProcessor,
    isHR,
    isAdmin,
    branch,
    user,
  } = useAuth();

  const navigate = useNavigate();

  const { tableState, tableDispatch } = useTableSettings();
  const [leaveCredit, setLeaveCredit] = useState("");

  /* If the current user level is neither HR/Admin/Approver/Outlet Processor/Payroll Master,
        DO NOT let them see all of the employees' filed leaves */
  // if (
  //   userLevel !== "HR" &&
  //   userLevel !== "Admin" &&
  //   userLevel !== "Approver" &&
  //   userLevel !== "Outlet Processor" &&
  //   userLevel !== "Payroll Master"
  // ) {
  //   tableDispatch({ type: "name", name: user });
  // }

  const {
    data: leaves,
    isSuccess: leaveSuccess,
    isLoading: leaveLoading,
    isError: leaveError,
    error: leaveerr,
  } = useGetLeavesQuery();

  // DROPDOWN DATA
  const startYear = 2018;
  const yearsArr = Array.from(
    { length: new Date().getFullYear() - startYear + 1 },
    (_, i) => startYear + i
  );
  const monthsArr = Array.from({ length: 12 }, (_, index) => {
    // Create a date for the first day of each month in current year
    const date = new Date(startYear, index, 1);
    // Get the short name of the month using toLocaleString()
    return date.toLocaleString("default", { month: "short" });
  });

  // DROPDOWNS
  const yearDropdown = yearsArr.map((yr, index) => {
    return (
      <option value={yr} key={index}>
        {yr}
      </option>
    );
  });

  const monthDropdown = monthsArr.map((month, index) => {
    return (
      <option value={month} key={index}>
        {month}
      </option>
    );
  });

  const outletDropdown = Object.entries(ASSIGNEDOUTLET).map(([key, value]) => {
    return (
      <option value={value} key={key}>
        {key}
      </option>
    );
  });

  const handleHover = (leaveCredit) => {
    setLeaveCredit(leaveCredit);
  };

  const handleSortIconChange = () => {
    tableDispatch({ type: "datesort" });
  };
  const handleNext = () => {
    tableDispatch({ type: "slice_inc" });
  };
  const handlePrev = () => {
    tableDispatch({ type: "slice_dec" });
  };

  if (leaveError) return <p>{leaveerr}</p>;

  if (leaveLoading) return <Spinner animation="border" />;

  let overallLeavesContent;

  if (leaveSuccess) {
    // Deconstruct leave data
    const { ids, entities } = leaves;

    // Preprocess data
    const leavesList = ids
      .filter((id) => {
        let match = true;

        // Name
        if (tableState.name) {
          match =
            match &&
            entities[id].FiledFor?.FullName.toLowerCase().includes(
              tableState.name
            );
        } else if (isUser) {
          match = match && entities[id].FiledFor?.EmployeeID === employeeId;
        }

        // Year
        if (tableState.year) {
          match =
            match &&
            new Date(entities[id].DateFiled).getFullYear() === tableState.year;
        }

        // Month
        if (tableState.month) {
          match =
            match &&
            new Date(entities[id].DateFiled).toLocaleString("default", {
              month: "short",
            }) === tableState.month;
        }

        // Outlet
        if (tableState.outletFilter) {
          match =
            match &&
            entities[id].FiledFor?.AssignedOutlet === tableState.outletFilter;
        }

        return match && entities[id].FiledFor?.EmployeeID !== 1;
      })
      .map((id) => entities[id]);

    // Render the component
    overallLeavesContent = leavesList
      .slice(tableState.sliceStart, tableState.sliceEnd)
      .map((leave) => (
        <Leave key={leave.id} leave={leave} handleHover={handleHover} />
      ));

    return (
      <Container>
        <Row className="mb-3">
          <Col>
            <h3>Leaves</h3>
          </Col>
          <Col>
            <Stack direction="horizontal" gap={1}>
              <OverlayTrigger
                overlay={TooltipRenderer({ tip: "File new leave" })}
              >
                <Button
                  className="ms-auto"
                  variant="outline-primary"
                  onClick={() => navigate("/leaves/new")}
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                </Button>
              </OverlayTrigger>
              {(isHR || isAdmin) && (
                <OverlayTrigger
                  overlay={TooltipRenderer({ tip: "Increase credits" })}
                >
                  <Button
                    variant="outline-success"
                    onClick={() => navigate("/leaves/increasecredits")}
                  >
                    <FontAwesomeIcon icon={faLevelUp} />
                  </Button>
                </OverlayTrigger>
              )}
            </Stack>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table
              bordered
              striped
              hover
              className="align-middle ms-3 mt-3 mb-3 caption-top"
            >
              <caption>Overall Filed Leaves</caption>
              <thead>
                <tr className="align-middle">
                  <th scope="col">Employee</th>
                  <th scope="col" onClick={handleSortIconChange}>
                    Date Filed{" "}
                    <FontAwesomeIcon
                      className="float-end"
                      icon={tableState.dateSortIcon}
                    />
                  </th>
                  <th scope="col">From</th>
                  <th scope="col">Until</th>
                  <th scope="col"># of Days</th>
                  <th scope="col">Type</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>{overallLeavesContent}</tbody>
              <tfoot>
                <tr>
                  <td colSpan={7} className="bg-secondary-subtle">
                    <Form>
                      <Row className="align-items-center">
                        <Col xs={12} sm={6} lg={3}>
                          <Form.Control
                            type="text"
                            value={tableState.name}
                            placeholder="Enter name"
                            disabled={isUser}
                            onChange={(e) => {
                              tableDispatch({
                                type: "name",
                                name: e.target.value,
                              });
                            }}
                          />
                        </Col>
                        <Col xs={12} sm={6} lg={3}>
                          <Form.Select
                            value={tableState.year}
                            onChange={(e) => {
                              tableDispatch({
                                type: "year",
                                year: e.target.value,
                              });
                            }}
                          >
                            <option value={""}>Year</option>
                            {yearDropdown}
                          </Form.Select>
                        </Col>
                        <Col xs={12} sm={6} lg={3}>
                          <Form.Select
                            value={tableState.month}
                            onChange={(e) => {
                              tableDispatch({
                                type: "month",
                                month: e.target.value,
                              });
                            }}
                          >
                            <option value={""}>Month</option>
                            {monthDropdown}
                          </Form.Select>
                        </Col>
                        <Col xs={12} sm={6} lg={3}>
                          <Form.Select
                            value={tableState.outletFilter}
                            disabled={isUser || isOutletProcessor}
                            onChange={(e) => {
                              tableDispatch({
                                type: "outlet_filter",
                                outletFilter: e.target.value,
                              });
                            }}
                          >
                            {outletDropdown}
                          </Form.Select>
                        </Col>
                      </Row>
                    </Form>
                  </td>
                </tr>
                <tr>
                  <td colSpan={7} className="bg-secondary-subtle">
                    <Row>
                      <Col className="d-flex justify-content-end">
                        <Button
                          variant="outline-primary"
                          onClick={handlePrev}
                          disabled={!tableState.sliceStart}
                        >
                          Prev
                        </Button>
                        <Button
                          className="ms-2"
                          variant="outline-primary"
                          onClick={handleNext}
                          disabled={tableState.sliceEnd >= leavesList.length}
                        >
                          Next
                        </Button>
                      </Col>
                    </Row>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Col>
          <Col md="auto">
            <Table
              size="sm"
              striped
              bordered
              hover
              className="align-middle ms-3 mt-3 mb-3 caption-top sticky-top"
            >
              <caption>
                {isHR || isAdmin || isOutletProcessor
                  ? `Leave Credit Info of ${
                      leaveCredit?.CreditsOf?.LastName ?? ""
                    }`
                  : "Your Credit Info"}
              </caption>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Used</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {leaveCredit ? (
                  <>
                    <tr>
                      <td className="fw-semibold">Sick</td>
                      <td>{leaveCredit?.CreditBudget}</td>
                      <td>
                        {leaveCredit?.SickLeave &&
                          leaveCredit?.CreditBudget - leaveCredit?.SickLeave}
                      </td>
                      <td>{leaveCredit?.SickLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Vacation</td>
                      <td>{leaveCredit?.CreditBudget}</td>
                      <td>
                        {leaveCredit?.VacationLeave &&
                          leaveCredit?.CreditBudget -
                            leaveCredit?.VacationLeave}
                      </td>
                      <td>{leaveCredit?.VacationLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Birthday</td>
                      <td>{leaveCredit?.BirthdayLeave ? 1 : 0}</td>
                      <td>
                        {leaveCredit?.CreditBudget &&
                        !leaveCredit?.BirthdayLeave
                          ? 1
                          : 0}
                      </td>
                      <td>{leaveCredit?.BirthdayLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Maternity</td>
                      <td>{leaveCredit?.MaternityLeave && 105}</td>
                      <td>
                        {leaveCredit?.MaternityLeave &&
                          105 - leaveCredit?.MaternityLeave}
                      </td>
                      <td>{leaveCredit?.MaternityLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Paternity</td>
                      <td>{leaveCredit?.PaternityLeave && 7}</td>
                      <td>
                        {leaveCredit?.PaternityLeave &&
                          7 - leaveCredit?.PaternityLeave}
                      </td>
                      <td>{leaveCredit?.PaternityLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Matrimonial</td>
                      <td>{leaveCredit?.MatrimonialLeave && 7}</td>
                      <td>
                        {leaveCredit?.MatrimonialLeave &&
                          7 - leaveCredit?.MatrimonialLeave}
                      </td>
                      <td>{leaveCredit?.MatrimonialLeave}</td>
                    </tr>
                    <tr>
                      <td className="fw-semibold">Print:</td>
                      <td colSpan={3}>
                        <Button
                          variant="outline-secondary"
                          className="me-2"
                          value={"Detailed"}
                          onClick={(e) =>
                            PrintLeave({
                              leaveToPrint: e.target.value,
                              leaves: leaves.ids.map(
                                (id) => leaves.entities[id]
                              ),
                              leaveCredit,
                              empId: leaveCredit.CreditsOf?.EmployeeID,
                            })
                          }
                        >
                          Detailed
                        </Button>
                        <Button
                          value={"Summary"}
                          variant="outline-secondary"
                          onClick={(e) =>
                            PrintLeave({
                              leaveToPrint: e.target.value,
                              leaves: leaves.ids.map(
                                (id) => leaves.entities[id]
                              ),
                              leaveCredit,
                              empId: leaveCredit.CreditsOf?.EmployeeID,
                            })
                          }
                        >
                          Summary
                        </Button>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td as={Col} colSpan={4}>
                        No leave credit data to display...
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default LeavesList;
