import React, { useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Spinner,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faSortNumericAsc,
  faSortNumericDesc,
} from "@fortawesome/free-solid-svg-icons";
import { useGetLeaveCreditsQuery, useGetLeavesQuery } from "./leavesApiSlice";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import useTitle from "../../hooks/useTitle";
import Leave from "./Leave";

const LeavesList = () => {
  useTitle("Leaves | Via Mare HRIS");

  const navigate = useNavigate();

  const [leaveCredit, setLeaveCredit] = useState("");

  const {
    data: leavecredits,
    isLoading: creditsLoading,
    isSuccess: creditsSuccess,
    isError: creditsError,
    error: credserr,
  } = useGetLeaveCreditsQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: leaves,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetLeavesQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const handleHover = (employeeId) => {
    if (creditsSuccess && !creditsLoading && !creditsError) {
      const { ids, entities } = leavecredits;

      const leavecredit = ids?.length
        ? ids
            .filter((id) => {
              return entities[id]?.EmployeeID === employeeId;
            })
            .map((id) => entities[id])[0]
        : "";

      setLeaveCredit(leavecredit);
    }
  };

  const [name, setName] = useState("");

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const start = new Date().getFullYear();
  const yearsArr = Array.from({ length: start - 2010 + 1 }, (_, i) => 2010 + i);
  const monthsArr = Array.from({ length: 12 }, (_, index) => index).map(
    (monthNum) => format(new Date(2023, monthNum, 1), "MMM")
  );

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

  const sortIconArr = [faSortNumericDesc, faSortNumericAsc];
  const [sortIcon, setSortIcon] = useState(0);

  const handleSortIconChange = () =>
    setSortIcon((prev) => (prev === 0 ? prev + 1 : prev - 1));

  const [startSlice, setStartSlice] = useState(0);
  const [endSlice, setEndSlice] = useState(10);

  const handleNext = () => {
    setStartSlice((prev) => prev + 10);
    setEndSlice((prev) => prev + 10);
  };
  const handlePrev = () => {
    setStartSlice((prev) => prev - 10);
    setEndSlice((prev) => prev - 10);
  };

  if (isLoading) return <Spinner animation="border" />;

  if (isError) {
    return <p className="text-danger">{error?.data?.message}</p>;
  }

  let overallLeavesContent;
  if (isSuccess) {
    const { ids, entities } = leaves;

    const filteredIds = ids.filter((id) => {
      const leave = entities[id];
      let matches = true;

      if (name !== "") {
        matches =
          matches && leave.User.toLowerCase().includes(name.toLowerCase());
      }

      if (month !== "") {
        matches = matches && leave.DateOfFilling.includes(month);
      }

      if (year !== "") {
        matches = matches && leave.DateOfFilling.includes(year);
      }

      return matches;
    });

    overallLeavesContent = filteredIds?.length
      ? [...filteredIds]
          .sort((a, b) => {
            return sortIcon === 0 ? -1 : 1;
          })
          .slice(startSlice, endSlice)
          .map((leaveId) => (
            <Leave key={leaveId} leaveId={leaveId} handleHover={handleHover} />
          ))
      : null;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h3>Leaves</h3>
        </Col>
        <Col>
          <Button
            className="float-end"
            variant="outline-primary"
            onClick={() => navigate("/leaves/new")}
          >
            <FontAwesomeIcon icon={faFileAlt} />
          </Button>
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
                <th scope="col">User</th>
                <th scope="col" onClick={handleSortIconChange}>
                  Date Filed{" "}
                  <FontAwesomeIcon
                    className="float-end"
                    icon={sortIconArr[sortIcon]}
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
                <td>
                  <Form>
                    <Form.Control
                      type="text"
                      placeholder="Type name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form>
                </td>
                <td>
                  <Form>
                    <Form.Select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value={""}>Select year</option>
                      {yearDropdown}
                    </Form.Select>
                  </Form>
                </td>
                <td>
                  <Form>
                    <Form.Select
                      value={month}
                      disabled={!year}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      <option value={""}>Select month</option>
                      {monthDropdown}
                    </Form.Select>
                  </Form>
                </td>
                <td colSpan={4}>
                  <Button
                    className="float-end ms-2"
                    variant="outline-secondary"
                    onClick={handleNext}
                    disabled={startSlice >= leaves?.ids?.length}
                  >
                    Next
                  </Button>
                  <Button
                    className="float-end"
                    variant="outline-secondary"
                    onClick={handlePrev}
                    disabled={startSlice === 0}
                  >
                    Prev
                  </Button>
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
            <caption>Leave Credit Info</caption>
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
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="fw-semibold">Vacation Leave</td>
                <td>{leaveCredit?.VacationLeave}</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="fw-semibold">Birthday Leave</td>
                <td>{leaveCredit?.BirthdayLeave}</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="fw-semibold">Maternity Leave</td>
                <td>{leaveCredit?.MaternityLeave}</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="fw-semibold">Paternity Leave</td>
                <td>{leaveCredit?.PaternityLeave}</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="fw-semibold">Matrimonial Leave</td>
                <td>{leaveCredit?.MatrimonialLeave}</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr>
                <td className="fw-semibold">Bereavement Leave</td>
                <td>{leaveCredit?.BereavementLeave}</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default LeavesList;
