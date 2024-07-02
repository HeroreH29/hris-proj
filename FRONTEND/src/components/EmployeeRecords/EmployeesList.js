import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { useGetAllOutletsQuery } from "../../app/api/slices/outletsApiSlice";
import useTableSettings from "../../hooks/useTableSettings";
import { useGetAllEmployeeInfosQuery } from "../../app/api/slices/employeeInfoApiSlice";
import { EMPSTATUS } from "../../config/gInfoOptions";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import Employee from "./Employee";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDownAZ,
  faArrowUpAZ,
  faPrint,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

const EmployeesList = () => {
  const navigate = useNavigate();

  const { isX } = useAuth();

  useTitle("Employee Records | HRIS Project");

  const {
    data: employeeinfos,
    isSuccess: isEmployeeSuccess,
    isLoading: isEmployeeLoading,
    isError: isEmployeeError,
    error: employeeErr,
  } = useGetAllEmployeeInfosQuery("", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
    pollingInterval: 5000,
  });

  const {
    data: outlets,
    isSuccess: isOutletSuccess,
    isLoading: isOutletLoading,
    isError: isOutletError,
    error: outletError,
  } = useGetAllOutletsQuery();

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

  if (isEmployeeLoading && isOutletLoading)
    return <Spinner animation="border" />;

  if (isEmployeeError && isOutletError)
    return (
      <p className="text-danger">
        Page err: {employeeErr?.data?.message || outletError?.data?.message}
      </p>
    );

  console.log(tableState.outletFilter);

  if (isEmployeeSuccess && isOutletSuccess) {
    const { ids: einfoids, entities: einfoentities } = employeeinfos;

    const filteredIds = einfoids
      ?.filter((id) => {
        const geninfo = einfoentities[id].GenInfo;
        let matches = true;

        const searchLowerCase = tableState.searchValue?.toLowerCase();
        const outletFilterLowerCase = tableState.outletFilter?.toLowerCase();
        const statusFilterLowerCase = tableState.statusFilter?.toLowerCase();

        if (tableState.searchValue !== "") {
          matches =
            (matches &&
              geninfo.LastName?.toLowerCase().includes(searchLowerCase)) ||
            geninfo.FirstName?.toLowerCase().includes(searchLowerCase);
        }

        if (tableState.outletFilter !== "") {
          matches =
            matches &&
            geninfo.AssignedOutlet?.toLowerCase() === outletFilterLowerCase;
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
          ? einfoentities[a].GenInfo.LastName.localeCompare(
              einfoentities[b].GenInfo.LastName
            )
          : einfoentities[b].GenInfo.LastName.localeCompare(
              einfoentities[a].GenInfo.LastName
            );
      });

    const tableContent =
      einfoids?.length &&
      [...filteredIds]
        .slice(tableState.sliceStart, tableState.sliceEnd)
        .map((einfoid) => {
          return <Employee key={einfoid} einfo={einfoentities[einfoid]} />;
        });

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
                    <option key={""} value={""}>
                      Select outlet...
                    </option>
                    {assignedOutletOptions}
                  </Form.Select>
                </Form>
              </td>
              <td className="bg-secondary-subtle">
                <Button variant="outline-primary" type="button">
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
                    <option key={""} value={""}>
                      Select status...
                    </option>
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

  return null;
};

export default EmployeesList;
