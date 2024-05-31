import React, { useEffect } from "react";
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
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import { ASSIGNEDOUTLET, EMPSTATUS } from "../../config/gInfoOptions";
import useAuth from "../../hooks/useAuth";
import useTableSettings from "../../hooks/useTableSettings";
import PrintPerBranch from "./PrintPerBranch";
import EmployeeNotifier from "./EmployeeNotifier";
import { toast } from "react-toastify";

const RecordsList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isX, canX } = useAuth();

  useTitle("Employee Records | Via Mare HRIS");

  // VARIABLES
  const { tableState, tableDispatch } = useTableSettings();

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

  // Employee Assesment and Regularization Notifier
  useEffect(() => {
    if (geninfos?.ids?.length > 0) {
      const { ids: gids, entities: gentities } = geninfos;

      // For notifying HR/Admin or Outlet Processor for employee regularization
      if (location.pathname === "/employeerecords") {
        EmployeeNotifier({ gids, gentities, tableState, isX });
      }
    }

    // eslint-disable-next-line
  }, [geninfos]);

  if (genLoading) return <Spinner animation="border" />;

  if (genError)
    return <p className="text-danger">geninfo err: {gerror?.data?.message}</p>;

  if (genSuccess) {
    const { ids: gids, entities: gentities } = geninfos;

    const filteredIds = gids
      ?.filter((id) => {
        const geninfo = gentities[id];
        let matches = true;

        const searchLowerCase = tableState.searchValue?.toLowerCase();
        const outletFilterLowerCase = tableState.outletFilter?.toLowerCase();
        const statusFilterLowerCase = tableState.statusFilter?.toLowerCase();

        if (tableState.searchValue !== "") {
          matches =
            (matches &&
              geninfo.LastName.toLowerCase().includes(searchLowerCase)) ||
            geninfo.FirstName.toLowerCase().includes(searchLowerCase);
        }

        if (tableState.outletFilter !== "") {
          matches =
            matches &&
            geninfo.AssignedOutlet.toLowerCase() === outletFilterLowerCase;
        }

        if (tableState.statusFilter !== "") {
          matches =
            matches &&
            geninfo?.EmpStatus?.toLowerCase() === statusFilterLowerCase;
        }

        return matches && geninfo?.EmployeeID !== 1;
      })
      .sort((a, b) => {
        return !tableState.nameSort
          ? gentities[a].LastName.localeCompare(gentities[b].LastName)
          : gentities[b].LastName.localeCompare(gentities[a].LastName);
      });

    // This is for printing employees per branch
    const filteredIdsForPrint = gids
      ?.filter((id) => {
        const geninfo = gentities[id];
        let matches = true;

        const outletFilterLowerCase = tableState.outletFilter?.toLowerCase();
        const statusFilterLowerCase = tableState.statusFilter?.toLowerCase();

        if (tableState.outletFilter !== "") {
          matches =
            matches &&
            geninfo.AssignedOutlet.toLowerCase() === outletFilterLowerCase;
        }

        if (tableState.statusFilter !== "") {
          matches =
            matches &&
            geninfo?.EmpStatus?.toLowerCase() === statusFilterLowerCase;
        }

        return matches && geninfo?.EmployeeID !== 1;
      })
      .sort((a, b) => {
        return !tableState.nameSort
          ? gentities[a].LastName.localeCompare(gentities[b].LastName)
          : gentities[b].LastName.localeCompare(gentities[a].LastName);
      });

    // Passing geninfo ids as table content
    const tableContent =
      gids?.length &&
      [...filteredIds]
        .slice(tableState.sliceStart, tableState.sliceEnd)
        .map((geninfoId) => <Record key={geninfoId} geninfoId={geninfoId} />);

    return (
      <Container>
        <Row>
          {!isX.isOutletProcessor && (
            <Col>
              <h3>Employee Records</h3>
              <small>{`(Click a record to view/edit)`}</small>
            </Col>
          )}

          <Col md="auto">
            {canX.canCreate && canX.canUpdate && canX.canDelete && (
              <Button
                variant="outline-primary"
                onClick={() => {
                  navigate("/employeerecords/new");
                  toast.dismiss();
                }}
              >
                <FontAwesomeIcon icon={faUserPlus} />
              </Button>
            )}
          </Col>
        </Row>
        <Table bordered striped hover className="align-middle ms-3 mt-3 mb-3">
          <thead className="align-middle">
            <tr>
              <th scope="col">Employee ID</th>
              <th
                scope="col"
                onClick={() => tableDispatch({ type: "name_sort" })}
              >
                Name{" "}
                <FontAwesomeIcon
                  className="float-end"
                  icon={tableState.nameSort ? faArrowDownAZ : faArrowUpAZ}
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
                    value={tableState.searchValue}
                    onChange={(e) => {
                      tableDispatch({
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
                    disabled={
                      !canX.canCreate && !canX.canUpdate && !canX.canDelete
                    }
                    value={tableState.outletFilter}
                    onChange={(e) => {
                      tableDispatch({
                        type: "outlet_filter",
                        outletFilter: e.target.value,
                      });
                    }}
                  >
                    {assignedOutletOptions}
                  </Form.Select>
                </Form>
              </td>
              <td className="bg-secondary-subtle">
                <Button
                  variant="outline-primary"
                  type="button"
                  onClick={() =>
                    PrintPerBranch({
                      branch: tableState.outletFilter,
                      employees: filteredIdsForPrint.map((id) => gentities[id]),
                    })
                  }
                >
                  <FontAwesomeIcon icon={faPrint} /> Employee List
                </Button>
              </td>
              <td className="bg-secondary-subtle">
                <Form>
                  <Form.Select
                    value={tableState.statusFilter}
                    onChange={(e) => {
                      tableDispatch({
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
                  disabled={tableState.sliceEnd >= filteredIds?.length}
                  onClick={() => tableDispatch({ type: "slice_inc" })}
                >
                  Next
                </Button>
                <Button
                  variant="outline-primary float-end me-3"
                  disabled={tableState.sliceStart === 0}
                  onClick={() => tableDispatch({ type: "slice_dec" })}
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
