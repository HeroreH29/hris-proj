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
import { format } from "date-fns";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import Attendance from "./Attendance";
import useTitle from "../../hooks/useTitle";

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
    isError: genError,
    error: gerror,
  } = useGetGeninfosQuery();

  useEffect(() => {}, [attList]);

  if (genLoading) return <Spinner animation="border" />;

  const AttlogFileUpload = (file) => {
    // Check if the uploaded file is an 'attlog.dat' file
    if (file.name.includes("attlog.dat") && genSuccess) {
      const reader = new FileReader();

      const { ids, entities } = geninfos;

      reader.onload = (event) => {
        const fileContents = event.target.result;

        const lines = fileContents.split("\n");
        setAttlogData(lines);

        const tempAttList = [];

        try {
          lines.forEach((line) => {
            const [bioId, datetime, val1, val2, val3, val4] = line.split("\t"); // eslint-disable-line no-unused-vars

            /* const formattedDate = format(new Date(datetime), "P");
            const formattedTime = format(new Date(datetime), "p"); */

            const matchedRecord = ids
              .filter(
                (id) => entities[id].BioID.toString() === bioId.toString()
              )
              .map((id) => entities[id])[0];

            /* const existingLine = tempAttList.findIndex((e) => {
              return e.bioId === bioId && e.date === formattedDate;
            }); */

            const existingLine = tempAttList.findIndex((e) => {
              return e.bioId === bioId;
            });

            if (existingLine === -1) {
              tempAttList.push({
                bioId: bioId,
                name: `${matchedRecord.LastName}, ${matchedRecord.FirstName} ${matchedRecord.MI}`,
                /* date: formattedDate,
                checkIn: val2 * 1 === 0 ? formattedTime : "",
                checkOut: val2 * 1 === 1 ? formattedTime : "",
                breakIn: val2 * 1 === 2 ? formattedTime : "",
                breakOut: val2 * 1 === 3 ? formattedTime : "", */
              });
              /* if (val2 * 1 === 0) {
                tempAttList[existingLine] = {
                  ...tempAttList[existingLine],
                  checkIn: formattedTime,
                };
              } else if (val2 * 1 === 1) {
                tempAttList[existingLine] = {
                  ...tempAttList[existingLine],
                  checkOut: formattedTime,
                };
              } else if (val2 * 1 === 2) {
                tempAttList[existingLine] = {
                  ...tempAttList[existingLine],
                  breakIn: formattedTime,
                };
              } else if (val2 * 1 === 3) {
                tempAttList[existingLine] = {
                  ...tempAttList[existingLine],
                  breakOut: formattedTime,
                };
              } */
            } /* else {
              tempAttList.push({
                bioId: bioId,
                name: `${matchedRecord.LastName}, ${matchedRecord.FirstName} ${matchedRecord.MI}`,
                date: formattedDate,
                checkIn: val2 * 1 === 0 ? formattedTime : "",
                checkOut: val2 * 1 === 1 ? formattedTime : "",
                breakIn: val2 * 1 === 2 ? formattedTime : "",
                breakOut: val2 * 1 === 3 ? formattedTime : "",
              });
            } */
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
        .map((att) => <Attendance att={att} attlogData={attlogData} />)
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
          className="align-middle ms-3 mt-3 mb-3 caption-top"
        >
          <caption>Click any to see a record's attendance</caption>
          <thead className="align-middle">
            <tr>
              <th scope="col">Biometric ID</th>
              <th scope="col">Name</th>
              {/* <th scope="col">Date</th>
              <th scope="col">Time-In</th>
              <th scope="col">Break-In</th>
              <th scope="col">Break-Out</th>
              <th scope="col">Time-Out</th> */}
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
