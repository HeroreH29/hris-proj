import React, { useState } from "react";
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
import { useGetLeavesQuery } from "./leavesApiSlice";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import useTitle from "../../hooks/useTitle";
import Leave from "./Leave";

const LeavesList = () => {
  useTitle("Leaves | Via Mare HRIS");

  const [contentLength, setContentLength] = useState(0);

  const [name, setName] = useState("");

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const start = new Date().getFullYear();
  const yearsArr = Array.from({ length: start - 2018 + 1 }, (_, i) => 2018 + i);
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

  const sortIconArr = [faSortNumericAsc, faSortNumericDesc];
  const [sortIcon, setSortIcon] = useState(0);

  const handleSortIconChange = () =>
    setSortIcon((prev) => (prev === 0 ? prev + 1 : prev - 1));

  const [startSlice, setStartSlice] = useState(0);
  const [endSlice, setEndSlice] = useState(20);

  const handleNext = () => {
    setStartSlice((prev) => prev + 20);
    setEndSlice((prev) => prev + 20);
  };
  const handlePrev = () => {
    setStartSlice((prev) => prev - 20);
    setEndSlice((prev) => prev - 20);
  };

  const {
    data: leaves,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetLeavesQuery();

  if (isLoading) return <Spinner animation="border" />;

  if (isError) {
    return <p className="text-danger">{error?.data?.message}</p>;
  }

  let overallLeavesContent;
  if (isSuccess) {
    const { ids, entities } = leaves;

    const leavesThisYear = ids.filter((id) =>
      entities[id]?.DateOfFilling.includes(new Date().getFullYear().toString())
    );

    console.log(leavesThisYear);

    const filteredIds = leavesThisYear.filter((id) => {
      const leave = entities[id];
      let matches = true; // Initial assumption: all conditions match

      if (name) {
        matches =
          matches && leave.User.toLowerCase().includes(name.toLowerCase());
      }

      if (month) {
        matches = matches && leave.DateOfFilling.includes(month);
      }

      if (year) {
        matches = matches && leave.DateOfFilling.includes(year);
      }

      return matches;
    });

    overallLeavesContent = filteredIds?.length
      ? [...filteredIds]
          .sort(() => {
            //setContentLength(filteredIds.length);
            return sortIcon === 0 ? 1 : -1;
          })
          .slice(startSlice, endSlice)
          .map((leaveId) => <Leave key={leaveId} leaveId={leaveId} />)
      : null;
  }

  return (
    <Container>
      <Row>
        <Col>
          <h3>Leaves</h3>
        </Col>
        <Col md="auto">
          <Button
            variant="outline-primary"
            onClick={() => console.log("file a leave")}
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
              <tr>
                <th scope="col">User</th>
                <th scope="col" onClick={handleSortIconChange}>
                  Filing Date{" "}
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
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      <option value={""}>Select month</option>
                      {monthDropdown}
                    </Form.Select>
                  </Form>
                </td>
                <td>
                  <Form>
                    <Form.Select
                      value={year}
                      disabled={!month}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value={""}>Select year</option>
                      {yearDropdown}
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
      </Row>
    </Container>
  );
};

export default LeavesList;
