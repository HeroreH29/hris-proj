import React from "react";
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
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import { EMPSTATUS } from "../../config/gInfoOptions";
import useAuth from "../../hooks/useAuth";
import useTableSettings from "../../hooks/useTableSettings";
import PrintPerBranch from "./PrintPerBranch";
import { toast } from "react-toastify";
import { useGetAllOutletsQuery } from "../../app/api/slices/outletsApiSlice";

const RecordsList = () => {
  const navigate = useNavigate();

  const { isX } = useAuth();

  useTitle("Employee Records | HRIS Project");

  const {
    data: outlets,
    isSuccess: isOutletSuccess,
    isLoading: isOutletLoading,
    isError: isOutletError,
    error: outletError,
  } = useGetAllOutletsQuery();

  // VARIABLES
  const { tableState, tableDispatch } = useTableSettings();

  const assignedOutletOptions = outlets?.ids.map((id) => {
    return (
      <option key={id} value={outlets.entities[id].Outlet}>
        {outlets.entities[id].Outlet}
      </option>
    );
  });
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

  if (genLoading && isOutletLoading) return <Spinner animation="border" />;

  if (genError && isOutletError)
    return (
      <p className="text-danger">
        Page err: {gerror?.data?.message || outletError?.data?.message}
      </p>
    );

  if (genSuccess && isOutletSuccess) {
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
          <Col>
            <h3>Employee Records</h3>
            <small>
              {!isX.isOutletProcessor ? `(Click a record to view/edit)` : ""}
            </small>
          </Col>

          <Col md="auto">
            {(isX.isHR || isX.isAdmin) && (
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
                    disabled={isX.isOutletProcessor}
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