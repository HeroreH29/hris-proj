import React, { useState } from "react";
import { useGetGeninfosQuery } from "./recordsApiSlice";
import Record from "./Record";
import { Table, Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faArrowUp,
  faArrowUpAZ,
  faArrowDownAZ,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
//import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const RecordsList = () => {
  const navigate = useNavigate();

  const [sliceStart, setSliceStart] = useState(0);
  const [sliceEnd, setSliceEnd] = useState(10);
  const [nameSort, setNameSort] = useState(false);

  const {
    data: geninfos,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetGeninfosQuery();

  if (isLoading) return <PulseLoader color="#808080" />;

  if (isError) return <p className="text-danger">{error?.data?.message}</p>;

  if (isSuccess) {
    const { ids, entities } = geninfos;

    const tableContent = ids?.length
      ? [...ids]
          .sort((a, b) => {
            return !nameSort
              ? entities[a].LastName.localeCompare(entities[b].LastName)
              : entities[b].LastName.localeCompare(entities[a].LastName);
          })
          .slice(sliceStart, sliceEnd)
          .map((geninfoId) => <Record key={geninfoId} geninfoId={geninfoId} />)
      : null;

    return (
      <Container>
        <Row>
          <Col>
            <h3>Employee Records</h3>
          </Col>

          <Col md="auto">
            <Button
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
              <td colSpan={5}>
                <Button
                  variant="outline-secondary float-end"
                  disabled={sliceEnd >= ids?.length}
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
