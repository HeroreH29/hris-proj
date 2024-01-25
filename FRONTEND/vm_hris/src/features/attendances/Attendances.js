import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import Attendance from "./Attendance";
import useTitle from "../../hooks/useTitle";
import { toast } from "react-toastify";

const Attendances = () => {
  useTitle("Attendances | Via Mare HRIS");

  const [attList, setAttList] = useState([]);
  const [attlogData, setAttlogData] = useState(undefined);

  const [startSlice, setStartSlice] = useState(0);
  const [endSlice, setEndSlice] = useState(20);

  const {
    data: geninfos,
    isSuccess: genSuccess,
    isLoading: genLoading,
    // eslint-disable-next-line
    isError: genError,
    // eslint-disable-next-line
    error: gerror,
  } = useGetGeninfosQuery();

  useEffect(() => {
    if (attList?.length > 0) {
      toast.success("Attlog uploaded!");
    }
  }, [attList]);

  if (genLoading) return <Spinner animation="border" />;

  const AttlogFileUpload = (file) => {
    // Check if the uploaded file is an 'attlog.dat' file
    if (file.name.includes("attlog.dat") && genSuccess) {
      const reader = new FileReader();

      const { ids, entities } = geninfos;

      reader.onload = (event) => {
        const fileContents = event.target.result;

        const lines = fileContents.split("\n").map((line) => line.trim());
        setAttlogData(lines);

        const tempAttList = [];

        try {
          lines.forEach((line) => {
            const [bioId, datetime, val1, val2, val3, val4] = line.split("\t"); // eslint-disable-line no-unused-vars

            const matchedRecord = ids
              .filter(
                (id) => entities[id].BioID.toString() === bioId.toString()
              )
              .map((id) => entities[id])[0];

            const existingLine = tempAttList.findIndex((e) => {
              return e.bioId === bioId;
            });

            if (existingLine === -1) {
              tempAttList.push({
                bioId: bioId,
                name: `${matchedRecord.LastName}, ${matchedRecord.FirstName} ${matchedRecord.MI}`,
              });
            }
          });
        } catch (error) {
          console.error(`AttlogFileUpload Error: ${error}`);
        }

        setAttList(tempAttList);
      };
      reader.readAsText(file);
    }
  };

  const tableContent = attList?.length
    ? attList
        .slice(startSlice, endSlice)
        .map((att) => (
          <Attendance key={att.bioId} att={att} attlogData={attlogData} />
        ))
    : null;

  const handleNextPage = () => {
    setStartSlice((prev) => prev + 20);
    setEndSlice((prev) => prev + 20);
  };

  const handlePrevPage = () => {
    setStartSlice((prev) => prev - 20);
    setEndSlice((prev) => prev - 20);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3>Attendances</h3>
        </Col>
      </Row>
      <Row className="p-2">
        <Form.Group className="mb-3">
          <Form.Label>Upload attlog file here</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => AttlogFileUpload(e.target.files[0])}
          />
        </Form.Group>
      </Row>
      <Row className="p-1">
        <Table
          bordered
          striped
          hover
          responsive
          className="align-middle ms-3 mt-3 mb-3 caption-top"
        >
          <caption>Click any to see a record's attendance</caption>
          <thead className="align-middle">
            <tr>
              <th scope="col">Biometric ID</th>
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <Button
                  variant="outline-secondary float-end"
                  onClick={handleNextPage}
                  disabled={endSlice >= attList?.length}
                >
                  Next
                </Button>
                <Button
                  variant="outline-secondary float-end me-3"
                  onClick={handlePrevPage}
                  disabled={startSlice === 0}
                >
                  Prev
                </Button>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Row>
    </Container>
  );
};

export default Attendances;
