import React, { useEffect, useState } from "react";
import { Row, Col, Button, Form, ListGroup, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { LEAVETYPES } from "../../config/leaveTypeOptions";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import { useAddNewLeaveMutation, useGetLeavesQuery } from "./leavesApiSlice";
import { differenceInDays, format } from "date-fns";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import useTitle from "../../hooks/useTitle";
import useLeaveForm from "../../hooks/useLeaveForm";

const NewLeaveForm = () => {
  useTitle("New Leave | HRIS Project");

  const navigate = useNavigate();

  const { user, employeeId, isX, branch } = useAuth();
  const { leaveState, leaveDispatch } = useLeaveForm();
  const { data: geninfos, isSuccess } = useGetGeninfosQuery();
  const {
    data: leaves,
    isSuccess: leaveSuccess,
    isLoading: leaveLoading,
    isError: leaveError,
    error: leaveerr,
  } = useGetLeavesQuery();
  const [
    addLeave,
    { isSuccess: addSuccess, isError: isAddError, error: addError },
  ] = useAddNewLeaveMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [validated, setValidated] = useState(false);
  const [datesWithLeaves, setDatesWithLeaves] = useState([]);
  const [isLeaveExisting, setIsLeaveExisting] = useState(false);

  // Dropdown options occupier
  const leaveTypeDropdown = Object.entries(LEAVETYPES).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {value}
      </option>
    );
  });

  // For searching employees
  const handleSearch = (e) => {
    if (isSuccess) {
      const { ids, entities } = geninfos;

      const records = ids.map((id) => entities[id]);

      setSearchQuery(e.target.value.toLowerCase());

      if (records) {
        const filteredResults = records.filter((info) => {
          let matches = true;

          if (isX.isOutletProcessor) {
            matches =
              matches &&
              info.AssignedOutlet === branch &&
              info.EmpStatus === "Y" &&
              info.FullName.toLowerCase().includes(searchQuery);
          } else {
            matches =
              matches &&
              info.EmpStatus === "Y" &&
              info.FullName.toLowerCase().includes(searchQuery);
          }

          return matches;
        });

        // console.log(filteredResults);
        setSearchResults(filteredResults);
      }
    }
  };
  // For selecting searched employee
  const handleSearchResultClick = (result) => {
    setSearchQuery(`${result?.FullName}. (${result?.EmployeeID})`);
    setSearchResults("");
    setSelectedEmployee(result);

    const { ids, entities } = leaves;
    const matchingLeaveRecords = ids
      .filter((id) => entities[id].FiledFor?.EmployeeID === result?.EmployeeID)
      .map((id) => entities[id]);

    const tempDatesWithLeaves = [];

    for (const leave of matchingLeaveRecords) {
      const noOfDays =
        differenceInDays(new Date(leave.Lto), new Date(leave.Lfrom)) + 1;

      let currentDate = new Date(leave.Lfrom);
      for (let i = 0; i < noOfDays; i++) {
        tempDatesWithLeaves.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    setDatesWithLeaves((prev) => [...prev, ...tempDatesWithLeaves]);
  };
  // Return to previous page handler
  const handlePreviousPage = () => navigate("/leaves");
  // Reset button handler
  const handleResetFields = () => {
    leaveDispatch({ type: "resetform" });
    setSelectedEmployee("");
    setSearchQuery("");
    setSearchResults("");
    setValidated(false);
  };
  // Leave file upload handler
  const LeaveApplicationUpload = (file) => {
    if (!file.type.startsWith("application/json")) {
      return toast.error("Invalid file type. Please upload a '.json' file", {
        containerId: "A",
      });
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const leaveData = JSON.parse(event.target.result);

      // Check first the uploaded leave if already existing. PREVENT UPLOAD if it is.
      const { ids } = leaves;
      const isExistingLeave = ids.some((id) => id === leaveData.id);
      if (isExistingLeave) {
        return toast.warn("Uploaded leave already exist in the system!", {
          containerId: "A",
        });
      }

      // Upload leave data to database
      const addPromise = new Promise((resolve) => {
        resolve(addLeave(leaveData));
      });

      toast
        .promise(
          addPromise,
          {
            pending: "Filing leave...",
            success: "New leave filed!",
            error: addError,
          },
          { containerId: "A" }
        )
        .then(() => {
          navigate("/leaves");
        });
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsText(file);
  };
  // Leave file submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (form.checkValidity()) {
      const confirm = window.confirm("Proceed with this information?");

      // For calculating no. of leave days
      const CalcuNoOfDays = () => {
        let days = 0;
        if (leaveState.DayTime) {
          days = 0.5;
        } else {
          days =
            differenceInDays(
              new Date(leaveState.Lto),
              new Date(leaveState.Lfrom)
            ) + 1;
        }
        return days;
      };

      if (confirm) {
        // Make Lto same as Lfrom if DayTime is truthy (non-null value)
        let lto;
        if (leaveState.DayTime !== "") {
          lto = format(new Date(leaveState.Lfrom), "MMM dd, yyyy");
        } else {
          lto = format(new Date(leaveState.Lto), "MMM dd, yyyy");
        }

        const leaveJson = {
          EmployeeID: selectedEmployee
            ? selectedEmployee?.EmployeeID
            : employeeId,
          DateFiled: format(new Date(), "P"),
          NoOfDays: CalcuNoOfDays(),
          DayTime: leaveState.DayTime,
          Ltype: leaveState.Ltype,
          Lfrom: format(new Date(leaveState.Lfrom), "MMM dd, yyyy"),
          Lto: lto,
          Reason: leaveState.Reason,
          FiledBy: user,
          FiledFor: selectedEmployee.id ?? selectedEmployee._id,
        };

        // Send data to database
        try {
          const addPromise = new Promise((resolve) => {
            resolve(addLeave(leaveJson));
          });

          toast
            .promise(
              addPromise,
              {
                pending: "Filing leave...",
                success: "New leave filed!",
                error: "Failed filing leave!",
              },
              { containerId: "A" }
            )
            .then(() => {
              navigate("/leaves");
            });
        } catch (error) {
          console.error(error.data.message);
        }
      }
    } else {
      e.stopPropagation();
    }

    setValidated(true);
  };

  // For automatically selecting the matching employee for "Users"
  if (isX.isUser && isSuccess) {
    const { ids, entities } = geninfos;

    const foundEmployee = ids.find(
      (id) => entities[id].EmployeeID === employeeId
    );

    if (!selectedEmployee) {
      setSelectedEmployee(entities[foundEmployee]);
    }
  }

  /* Leave existence checker */
  useEffect(() => {
    try {
      const isExisting = datesWithLeaves.some(
        (date) =>
          format(new Date(leaveState.Lfrom), "PP") === format(date, "PP") ||
          format(new Date(leaveState.Lto), "PP") === format(date, "PP")
      );
      setIsLeaveExisting(isExisting);
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line
  }, [leaveState.Lto, leaveState.Lfrom]);

  /* Leave existence toast trigger */
  useEffect(() => {
    try {
      let currentToastId;
      if (isLeaveExisting) {
        currentToastId = toast.warn("A filed leave exist on selected dates!", {
          containerId: "A",
        });
      } else {
        if (toast.isActive(currentToastId, "A")) toast.dismiss(currentToastId);
      }
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
  }, [leaveState.Lto, leaveState.Lfrom, isLeaveExisting]);

  /* Invalid date range checker */
  useEffect(() => {
    try {
      let currentToastId;
      const fromDate = new Date(leaveState.Lfrom).valueOf();
      const toDate = new Date(leaveState.Lto).valueOf();
      if (fromDate > toDate) {
        currentToastId = toast.warn(
          "Invalid date range. Double check selected dates!",
          {
            containerId: "A",
          }
        );
      } else {
        if (toast.isActive(currentToastId, "A")) toast.dismiss(currentToastId);
      }
    } catch (error) {
      console.log(error);
    }
  }, [leaveState.Lto, leaveState.Lfrom]);

  if (leaveLoading) return <Spinner animation="border" />;

  return (
    <>
      <Row>
        <Col md="auto">
          <Button variant="outline-secondary" onClick={handlePreviousPage}>
            <FontAwesomeIcon icon={faLeftLong} />
          </Button>
        </Col>
        <Col>
          <h3>New Leave</h3>
        </Col>
      </Row>
      <Form
        noValidate
        validated={validated}
        className="p-3"
        onSubmit={handleSubmit}
      >
        {(isX.isAdmin || isX.isProcessor || isX.isOutletProcessor) && (
          <>
            <Row className="mb-3">
              <Form.Group as={Col} md="4">
                <Form.Label className="fw-semibold">File for...</Form.Label>
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
              <Form.Group as={Col} className="p-2 border">
                <Form.Label className="fw-semibold">
                  ...or Upload a leave application
                </Form.Label>
                <Form.Control
                  type="file"
                  size="sm"
                  onChange={(e) => LeaveApplicationUpload(e.target.files[0])}
                />
              </Form.Group>
              {searchResults?.length > 0 && searchQuery.length > 0 && (
                <ListGroup>
                  {searchResults.map((result) => (
                    <ListGroup.Item
                      action
                      href={`#`}
                      key={result.id}
                      onClick={() => handleSearchResultClick(result)}
                    >{`${result?.FullName}`}</ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Row>
          </>
        )}
        {/* Leave type, half day, day time, leave from, leave until */}
        <Row className="align-items-center mb-3">
          <Form.Group as={Col}>
            <Form.Label className="fw-semibold">Leave Type</Form.Label>
            <Form.Select
              disabled={!selectedEmployee}
              required
              value={leaveState.Ltype}
              onChange={(e) =>
                leaveDispatch({ type: "ltype", Ltype: e.target.value })
              }
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
                checked={leaveState.HalfDay}
                disabled={!selectedEmployee}
                onChange={() => leaveDispatch({ type: "halfday" })}
              />
            </Form.Label>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label className="fw-semibold">Day Time</Form.Label>
            <Form.Select
              required
              disabled={!leaveState.HalfDay}
              value={leaveState.DayTime}
              onChange={(e) =>
                leaveDispatch({ type: "daytime", DayTime: e.target.value })
              }
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
              disabled={!selectedEmployee}
              type="date"
              value={leaveState.Lfrom}
              onChange={(e) =>
                leaveDispatch({ type: "lfrom", Lfrom: e.target.value })
              }
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
              value={leaveState.Lto}
              disabled={leaveState.HalfDay || !selectedEmployee}
              onChange={(e) =>
                leaveDispatch({ type: "lto", Lto: e.target.value })
              }
            />
            <Form.Control.Feedback type="invalid">
              Field is required
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        {/* Reason */}
        <Row className="mb-3">
          <Form.Group as={Col}>
            <Form.Label className="fw-semibold">Reason</Form.Label>
            <Form.Control
              required={leaveState.Ltype === "Sick Leave"}
              as={"textarea"}
              value={leaveState.Reason}
              disabled={!selectedEmployee}
              onChange={(e) =>
                leaveDispatch({ type: "reason", Reason: e.target.value })
              }
            />
            <Form.Control.Feedback type="invalid">
              Field is STRICTLY required
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        {/* Buttons */}
        <Row className="mb-3">
          <Form.Group as={Col} md="auto">
            <Button
              disabled={isLeaveExisting}
              type="submit"
              variant="outline-success"
            >
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
    </>
  );
};

export default NewLeaveForm;
