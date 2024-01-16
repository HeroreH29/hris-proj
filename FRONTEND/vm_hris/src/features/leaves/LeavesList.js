import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faSortNumericAsc,
  faSortNumericDesc,
} from "@fortawesome/free-solid-svg-icons";
import { useGetLeavesQuery } from "./leavesApiSlice";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import Leave from "./Leave";

const LeavesList = () => {
  useTitle("Leaves | Via Mare HRIS");

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
  } = useGetLeavesQuery(/* "leavesList", {
    pollingInterval: 10000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  } */);

  if (isLoading) return <Spinner animation="border" />;

  if (isError) {
    return <p className="text-danger">{error?.data?.message}</p>;
  }

  let overallLeavesContent;
  if (isSuccess) {
    const { ids } = leaves;

    overallLeavesContent = ids?.length
      ? [...ids]
          .sort(() => {
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
                <td colSpan={7}>
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
