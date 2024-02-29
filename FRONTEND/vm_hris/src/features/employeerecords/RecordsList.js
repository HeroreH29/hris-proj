import React, { useEffect, useState } from "react";
import { useGetGeninfosQuery } from "./recordsApiSlice";
import Record from "./Record";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faArrowUpAZ,
  faArrowDownAZ,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import { ASSIGNEDOUTLET, EMPSTATUS } from "../../config/gInfoOptions";
import { toast } from "react-toastify";
import { parse, differenceInDays, differenceInMonths } from "date-fns";
import useAuth from "../../hooks/useAuth";

const RecordsList = () => {
  const navigate = useNavigate();

  const { isOutletProcessor, branch } = useAuth();

  useTitle("Employee Records | Via Mare HRIS");

  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd] = useState(10);
  const [nameSort, setNameSort] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [outletFilter, setOutletFilter] = useState(
    isOutletProcessor ? branch : ""
  );
  const [statusFilter, setStatusFilter] = useState("Y");

  const assignedOutletOptions = Object.entries(ASSIGNEDOUTLET).map(
    ([key, value]) => {
      return (
        <option key={key} value={value}>
          {key}
        </option>
      );
    }
  );
  const empStatusOptions = Object.entries(EMPSTATUS).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });

  const {
    data: geninfos,
    isSuccess: genSuccess,
    isLoading: genLoading,
    isError: genError,
    error: gerror,
  } = useGetGeninfosQuery();

  useEffect(() => {
    toast.clearWaitingQueue();
    if (geninfos?.ids?.length > 0) {
      const { ids: gids, entities: gentities } = geninfos;

      // For notifying HR/Admin or Outlet/Processor for employee regularization
      RegularizationNotifier(gids, gentities);
    }
  }, [geninfos]);

  const RegularizationNotifier = (gids, gentities) => {
    const toRegularize = gids
      .filter((gid) => {
        let match = true;

        if (isOutletProcessor) {
          match = match && gentities[gid]?.AssignedOutlet === branch;
        }

        return match;
      })
      .reduce((acc, gid) => {
        const dateToday = new Date();
        let parsedDate;

        if (
          gentities[gid]?.EmployeeType === "Probationary" &&
          gentities[gid].EmpStatus === "Y"
        ) {
          if (gentities[gid]?.RegDate) {
            parsedDate = parse(
              gentities[gid]?.RegDate,
              "MMMM dd, yyyy",
              new Date()
            );
            if (differenceInDays(dateToday, parsedDate) >= 1) {
              acc.push(gentities[gid].EmployeeID);
            }
          } else if (gentities[gid]?.DateProbationary) {
            parsedDate = parse(
              gentities[gid]?.DateProbationary,
              "MMM dd, yyyy",
              new Date()
            );
            if (differenceInMonths(dateToday, parsedDate) >= 6) {
              acc.push(gentities[gid].EmployeeID);
            }
          } else if (gentities[gid]?.DateEmployed) {
            parsedDate = parse(
              gentities[gid]?.DateEmployed,
              "MMM dd, yyyy",
              new Date()
            );
            if (differenceInMonths(dateToday, parsedDate) >= 6) {
              acc.push(gentities[gid].EmployeeID);
            }
          }
        }
        return acc;
      }, []);

    toRegularize.forEach((e) => {
      toast.info(`"${e}" needs to be regularized`, {
        autoClose: false,
        toastId: e,
        onClick: () => {
          const newTab = window.open("", "_blank");
          newTab.location.href = `/employeerecords/${e}`;
        },
      });
    });
  };

  if (genLoading) return <Spinner animation="border" />;

  if (genError)
    return <p className="text-danger">geninfo err: {gerror?.data?.message}</p>;

  if (genSuccess) {
    const { ids: gids, entities: gentities } = geninfos;

    const filteredIds = gids?.filter((id) => {
      const geninfo = gentities[id];
      let matches = true;

      const searchLowerCase = searchValue.toLowerCase();
      const outletFilterLowerCase = outletFilter.toLowerCase();
      const statusFilterLowerCase = statusFilter.toLowerCase();

      if (searchValue !== "") {
        matches =
          (matches &&
            geninfo.LastName.toLowerCase().includes(searchLowerCase)) ||
          geninfo.FirstName.toLowerCase().includes(searchLowerCase);
      }

      if (outletFilter !== "") {
        matches =
          matches &&
          geninfo.AssignedOutlet.toLowerCase() === outletFilterLowerCase;
      }

      if (statusFilter !== "") {
        matches =
          matches && geninfo.EmpStatus.toLowerCase() === statusFilterLowerCase;
      }

      return matches;
    });

    // Passing geninfo ids as table content
    const tableContent = gids?.length
      ? [...filteredIds]
          .sort((a, b) => {
            return !nameSort
              ? gentities[a].LastName.localeCompare(gentities[b].LastName)
              : gentities[b].LastName.localeCompare(gentities[a].LastName);
          })
          .slice(sliceStart, sliceEnd)
          .map((geninfoId) => <Record key={geninfoId} geninfoId={geninfoId} />)
      : null;

    return (
      <Container>
        <Row>
          <Col>
            <h3>Employee Records</h3>
            <small>{`(Click a record to view/edit)`}</small>
          </Col>

          <Col md="auto">
            {/* Temporarily disabled */}
            <Button
              variant="outline-primary"
              onClick={() => navigate("/employeerecords/new")}
            >
              <FontAwesomeIcon icon={faUserPlus} />
            </Button>
          </Col>
        </Row>
        <Table bordered striped hover className="align-middle ms-3 mt-3 mb-3">
          <thead className="align-middle">
            <tr>
              <th scope="col">Employee ID</th>
              <th scope="col" onClick={() => setNameSort(!nameSort)}>
                Name{" "}
                <FontAwesomeIcon
                  className="float-end"
                  icon={nameSort ? faArrowDownAZ : faArrowUpAZ}
                />
              </th>
              <th scope="col">Assigned Outlet</th>
              <th scope="col">Job Title</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
          <tfoot>
            <tr>
              <td className="bg-secondary-subtle"></td>
              <td className="bg-secondary-subtle">
                <Form>
                  <Form.Control
                    type="text"
                    placeholder="Search by Name"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setSliceStart(0);
                      setSliceEnd(10);
                    }}
                  />
                </Form>
              </td>
              <td className="bg-secondary-subtle">
                <Form>
                  <Form.Select
                    disabled={isOutletProcessor}
                    value={outletFilter}
                    onChange={(e) => {
                      setOutletFilter(e.target.value);
                      setSliceStart(0);
                      setSliceEnd(10);
                    }}
                  >
                    {assignedOutletOptions}
                  </Form.Select>
                </Form>
              </td>
              <td className="bg-secondary-subtle"></td>
              <td className="bg-secondary-subtle">
                <Form>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setSliceStart(0);
                      setSliceEnd(10);
                    }}
                  >
                    {empStatusOptions}
                  </Form.Select>
                </Form>
              </td>
            </tr>
            <tr>
              <td colSpan={5}>
                <Button
                  variant="outline-primary float-end"
                  disabled={
                    filteredIds?.length
                      ? sliceEnd >= filteredIds?.length
                      : sliceEnd >= gids?.length
                  }
                  onClick={() => {
                    setSliceStart((prev) => prev + 10);
                    setSliceEnd((prev) => prev + 10);
                  }}
                >
                  Next
                </Button>
                <Button
                  variant="outline-primary float-end me-3"
                  disabled={sliceStart === 0}
                  onClick={() => {
                    setSliceStart((prev) => prev - 10);
                    setSliceEnd((prev) => prev - 10);
                  }}
                >
                  Prev
                </Button>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Container>
    );
  }
};

export default RecordsList;
