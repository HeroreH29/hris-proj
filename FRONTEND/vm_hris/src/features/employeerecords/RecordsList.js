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
import useTableSettings from "../../hooks/useTableSettings";

const RecordsList = () => {
  const navigate = useNavigate();

  const { isOutletProcessor } = useAuth();

  useTitle("Employee Records | Via Mare HRIS");

  // VARIABLES
  const { state, dispatch } = useTableSettings();

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
    if (geninfos?.ids?.length > 0) {
      const { ids: gids, entities: gentities } = geninfos;

      // For notifying HR/Admin or Outlet/Processor for employee regularization
      RegularizationNotifier(gids, gentities);
    }

    // eslint-disable-next-line
  }, [geninfos]);

  const RegularizationNotifier = (gids, gentities) => {
    const toRegularize = gids
      .filter((gid) => {
        let match = true;

        if (isOutletProcessor) {
          match =
            match && gentities[gid]?.AssignedOutlet === state.outletFilter;
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
        toastId: e,
        position: "top-left",
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

      const searchLowerCase = state.searchValue.toLowerCase();
      const outletFilterLowerCase = state.outletFilter.toLowerCase();
      const statusFilterLowerCase = state.statusFilter.toLowerCase();

      if (state.searchValue !== "") {
        matches =
          (matches &&
            geninfo.LastName.toLowerCase().includes(searchLowerCase)) ||
          geninfo.FirstName.toLowerCase().includes(searchLowerCase);
      }

      if (state.outletFilter !== "") {
        matches =
          matches &&
          geninfo.AssignedOutlet.toLowerCase() === outletFilterLowerCase;
      }

      if (state.statusFilter !== "") {
        matches =
          matches && geninfo.EmpStatus.toLowerCase() === statusFilterLowerCase;
      }

      return matches;
    });

    // Passing geninfo ids as table content
    const tableContent =
      gids?.length &&
      [...filteredIds]
        .sort((a, b) => {
          return !state.nameSort
            ? gentities[a].LastName.localeCompare(gentities[b].LastName)
            : gentities[b].LastName.localeCompare(gentities[a].LastName);
        })
        .slice(state.sliceStart, state.sliceEnd)
        .map((geninfoId) => <Record key={geninfoId} geninfoId={geninfoId} />);

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
              <th scope="col" onClick={() => dispatch({ type: "name_sort" })}>
                Name{" "}
                <FontAwesomeIcon
                  className="float-end"
                  icon={state.nameSort ? faArrowDownAZ : faArrowUpAZ}
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
                    value={state.searchValue}
                    onChange={(e) => {
                      dispatch({
                        type: "search_value",
                        searchValue: e.target.value,
                      });
                    }}
                  />
                </Form>
              </td>
              <td className="bg-secondary-subtle">
                <Form>
                  <Form.Select
                    disabled={isOutletProcessor}
                    value={state.outletFilter}
                    onChange={(e) => {
                      dispatch({
                        type: "outlet_filter",
                        outletFilter: e.target.value,
                      });
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
                    value={state.statusFilter}
                    onChange={(e) => {
                      dispatch({
                        type: "status_filter",
                        statusFilter: e.target.value,
                      });
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
                  disabled={state.sliceEnd >= filteredIds?.length}
                  onClick={() => dispatch({ type: "slice_inc" })}
                >
                  Next
                </Button>
                <Button
                  variant="outline-primary float-end me-3"
                  disabled={state.sliceStart === 0}
                  onClick={() => dispatch({ type: "slice_dec" })}
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
