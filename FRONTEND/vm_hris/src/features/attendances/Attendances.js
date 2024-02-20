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
import { ASSIGNEDOUTLET, EMPLOYEETYPE } from "../../config/gInfoOptions";

const Attendances = () => {
  useTitle("Attendances | Via Mare HRIS");

  const [attList, setAttList] = useState([]);
  const [attlogData, setAttlogData] = useState(undefined);

  const [startSlice, setStartSlice] = useState(0);
  const [endSlice, setEndSlice] = useState(20);

  const [outletFilter, setOutletFilter] = useState("");
  const [empTypeFilter, setEmpTypeFilter] = useState("");

  const outletOptions = Object.entries(ASSIGNEDOUTLET).map(([key, value]) => {
    return (
      <option key={key} value={value}>
        {key}
      </option>
    );
  });

  const empTypeOptions = Object.entries(EMPLOYEETYPE).map(([key, value]) => {
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
    // eslint-disable-next-line
    isError: genError,
    // eslint-disable-next-line
    error: gerror,
  } = useGetGeninfosQuery();

  useEffect(() => {
    if (attList?.length > 0) {
      toast.success("Attendance logs uploaded!");
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

        const base64String = btoa(fileContents);
        console.log("Base64 string:", base64String);

        const lines = fileContents.split("\n").map((line) => line.trim());
        setAttlogData(lines);

        const tempAttList = [];

        try {
          lines.forEach((line) => {
            const [bioId, datetime, val1, val2, val3, val4] = line.split("\t"); // eslint-disable-line no-unused-vars

            if (bioId !== "1") {
              const matchedRecord = ids
                .filter((id) => {
                  return String(entities[id].BioID) === String(bioId);
                })
                .map((id) => entities[id])[0];

              const existingLine = tempAttList.findIndex((e) => {
                return String(e.bioId) === String(bioId);
              });

              if (existingLine === -1) {
                tempAttList.push({
                  bioId: bioId,
                  name: `${matchedRecord?.LastName}, ${matchedRecord?.FirstName} ${matchedRecord?.MI}`,
                  outlet: matchedRecord?.AssignedOutlet,
                  empType: matchedRecord?.EmployeeType,
                });
              }
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

  const filteredList = attList?.filter((att) => {
    let matches = true;

    if (outletFilter !== "") {
      matches = matches && att?.outlet === outletFilter;
    }

    if (empTypeFilter !== "") {
      matches = matches && att?.empType === empTypeFilter;
    }

    return matches;
  });

  const tableContent = filteredList
    ?.sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
    .slice(startSlice, endSlice)
    .map((att) => (
      <Attendance key={att.bioId} att={att} attlogData={attlogData} />
    ));

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
          <Form.Label>Upload attlog file here:</Form.Label>
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
            </tr>
          </thead>
          <tbody>{tableContent}</tbody>
        </Table>
      </Row>
      <Row className="p-2">
        <Form.Group as={Col}>
          <Form.Select
            disabled={attList?.length === 0}
            onChange={(e) => {
              setOutletFilter(e.target.value);
              setStartSlice(0);
              setEndSlice(20);
            }}
            placeholder="Select outlet..."
            value={outletFilter}
          >
            {outletOptions}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Select
            disabled={attList?.length === 0}
            onChange={(e) => {
              setEmpTypeFilter(e.target.value);
              setStartSlice(0);
              setEndSlice(20);
            }}
            placeholder="Select type..."
            value={empTypeFilter}
          >
            {empTypeOptions}
          </Form.Select>
        </Form.Group>
        <Col>
          <Button
            variant="outline-secondary float-end"
            onClick={handleNextPage}
            disabled={endSlice >= filteredList?.length}
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
        </Col>
      </Row>
    </Container>
  );
};

export default Attendances;
