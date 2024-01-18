import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { LEAVETYPES } from "../../config/leaveTypeOptions";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import { useAddNewLeaveMutation } from "./leavesApiSlice";
import { differenceInDays, format } from "date-fns";
import useAuth from "../../hooks/useAuth";

const NewLeaveForm = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [leaveType, setLeaveType] = useState("");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveUntil, setLeaveUntil] = useState("");
  const [reason, setReason] = useState("");
  const [dayTime, setDayTime] = useState("");
  const [halfDay, setHalfDay] = useState(false);
  const [validated, setValidated] = useState(false);

  const {
    data: geninfos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetGeninfosQuery();

  const [
    addLeave,
    {
      isLoading: addLoading,
      isSuccess: addSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewLeaveMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const handleSearch = (e) => {
    const { ids, entities } = geninfos;

    setSearchQuery(e.target.value.toLowerCase());

    if (ids?.length) {
      const filteredResults = ids
        .filter((id) => {
          return (
            entities[id].LastName.toLowerCase().includes(searchQuery) ||
            entities[id].FirstName.toLowerCase().includes(searchQuery)
          );
        })
        .map((id) => entities[id]);

      setSearchResults(filteredResults);
    }
  };

  const handleSearchResultClick = (result) => {
    setSearchQuery(
      `${result.LastName}, ${result.FirstName} ${result.MI}. (${result.EmployeeID})`
    );
    setSearchResults("");
    setSelectedEmployee(result.EmployeeID);
  };

  const handlePreviousPage = () => navigate("/leaves");

  const leaveTypeDropdown = Object.entries(LEAVETYPES).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {value}
      </option>
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity()) {
      const confirm = window.confirm("Proceed with this information?");

      if (confirm) {
        const leaveJson = {
          EmployeeID: selectedEmployee,
          DateOfFilling: format(new Date(), "MMM dd, yyyy"),
          NoOfDays: dayTime
            ? 0.5
            : leaveFrom && leaveUntil
            ? differenceInDays(new Date(leaveUntil), new Date(leaveFrom)) + 1
            : 0,
          DayTime: dayTime,
          Ltype: leaveType,
          Lfrom: format(new Date(leaveFrom), "MMM dd, yyyy"),
          Lto: format(new Date(leaveUntil), "MMM dd, yyyy"),
          Reason: reason,
          User: user,
        };

        await addLeave(leaveJson);
      }
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  const handleResetFields = () => {
    setSelectedEmployee("");
    setLeaveType("");
    setLeaveFrom("");
    setLeaveUntil("");
    setHalfDay(false);
    setDayTime("");
    setReason("");
    setSearchQuery("");
    setSearchResults("");
    setValidated(false);
  };

  useEffect(() => {
    if (addSuccess) {
      handleResetFields();
      navigate("/leaves");
    }
    if (isAddError) {
      window.alert(`Something went wrong: ${addError}`);
    }
  }, [addSuccess, addError, isAddError, navigate]);

  return (
    <Container>
      <Row>
        <Col md="auto">
          <Button variant="outline-secondary" onClick={handlePreviousPage}>
            <FontAwesomeIcon icon={faLeftLong} />
          </Button>
        </Col>
        <Col>
          <h3>Leave Filing</h3>
        </Col>
      </Row>
      <Form
        noValidate
        validated={validated}
        className="p-3"
        onSubmit={handleSubmit}
      >
        <Row className="mb-3">
          <Form.Group as={Col} md="4">
            <Form.Label className="fw-semibold">File for</Form.Label>
            <Form.Control
              required
              autoFocus
              className="fw-semibold"
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search Employee..."
            />
            <Form.Control.Feedback type="invalid">
              Field required
            </Form.Control.Feedback>
          </Form.Group>
          {searchResults?.length > 0 && searchQuery.length > 0 && (
            <ListGroup>
              {searchResults.map((result) => (
                <ListGroup.Item
                  action
                  href={`#${result.EmployeeID}`}
                  key={result.id}
                  onClick={() => handleSearchResultClick(result)}
                >{`${result.LastName}, ${result.FirstName} ${result.MI}`}</ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Row>
        <Row className="align-items-center mb-3">
          <Form.Group as={Col}>
            <Form.Label className="fw-semibold">Leave Type</Form.Label>
            <Form.Select
              required
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="">Select type</option>
              {leaveTypeDropdown}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Field is required
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="auto">
            <Form.Label className="fw-semibold">
              Half Day?
              <Form.Check
                className="ms-3 float-end"
                type="checkbox"
                checked={halfDay}
                onChange={(e) => {
                  setHalfDay(e.target.checked);
                  setDayTime("");
                }}
              />
            </Form.Label>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label className="fw-semibold">Day Time</Form.Label>
            <Form.Select
              required
              disabled={!halfDay}
              value={dayTime}
              onChange={(e) => setDayTime(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Field is required
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label className="fw-semibold">From</Form.Label>
            <Form.Control
              required
              type="date"
              value={leaveFrom}
              onChange={(e) => setLeaveFrom(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Field is required
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label className="fw-semibold">Until</Form.Label>
            <Form.Control
              required
              type="date"
              value={leaveUntil}
              disabled={halfDay}
              onChange={(e) => setLeaveUntil(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Field is required
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label className="fw-semibold">Reason</Form.Label>
            <Form.Control
              required
              as={"textarea"}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Field is required
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="auto">
            <Button type="submit" variant="outline-success">
              File Leave
            </Button>
          </Form.Group>
          <Form.Group as={Col} md="auto">
            <Button
              type="button"
              variant="outline-danger"
              onClick={handleResetFields}
            >
              Reset
            </Button>
          </Form.Group>
        </Row>
      </Form>
    </Container>
  );
};

export default NewLeaveForm;
