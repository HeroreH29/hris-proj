import React, { useState } from "react";
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

const RecordsList = () => {
  const navigate = useNavigate();

  useTitle("Employee Records | Via Mare HRIS");

  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd] = useState(10);
  const [nameSort, setNameSort] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [outletFilter, setOutletFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  if (genLoading) return <Spinner animation="border" />;

  if (genError)
    return <p className="text-danger">geninfo err: {gerror?.data?.message}</p>;

  if (genSuccess) {
    const { ids: gids, entities: gentities } = geninfos;

    const filteredIds = gids?.filter((id) => {
      const geninfo = gentities[id];

      const searchLowerCase = searchValue.toLowerCase();
      const outletFilterLowerCase = outletFilter.toLowerCase();
      const statusFilterLowerCase = statusFilter.toLowerCase();

      const matchesSearch =
        !searchValue ||
        geninfo.LastName.toLowerCase().includes(searchLowerCase) ||
        geninfo.FirstName.toLowerCase().includes(searchLowerCase);

      const matchesOutlet =
        !outletFilter ||
        geninfo.AssignedOutlet.toLowerCase() === outletFilterLowerCase;
      const matchesStatus =
        !statusFilter ||
        geninfo.EmpStatus.toLowerCase() === statusFilterLowerCase;

      return matchesSearch && matchesOutlet && matchesStatus;
    });

    // Passing geninfo ids as table content
    const tableContent = gids?.length
      ? searchValue.trim() === ""
        ? [...gids]
            .sort((a, b) => {
              return !nameSort
                ? gentities[a].LastName.localeCompare(gentities[b].LastName)
                : gentities[b].LastName.localeCompare(gentities[a].LastName);
            })
            .slice(sliceStart, sliceEnd)
            .map((geninfoId) => (
              <Record key={geninfoId} geninfoId={geninfoId} />
            ))
        : filteredIds
            .sort((a, b) => {
              return !nameSort
                ? gentities[a].LastName.localeCompare(gentities[b].LastName)
                : gentities[b].LastName.localeCompare(gentities[a].LastName);
            })
            .slice(sliceStart, sliceEnd)
            .map((geninfoId) => (
              <Record key={geninfoId} geninfoId={geninfoId} />
            ))
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
              disabled
              variant="outline-primary"
              onClick={() => navigate("/users/new")}
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
              <td></td>
              <td>
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
              <td>
                <Form>
                  <Form.Select
                    onChange={(e) => setOutletFilter(e.target.value)}
                  >
                    {assignedOutletOptions}
                  </Form.Select>
                </Form>
              </td>
              <td>{}</td>
              <td>
                <Form>
                  <Form.Select
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {empStatusOptions}
                  </Form.Select>
                </Form>
              </td>
            </tr>
            <tr>
              <td colSpan={5}>
                <Button
                  variant="outline-secondary float-end"
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
                  variant="outline-secondary float-end me-3"
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
