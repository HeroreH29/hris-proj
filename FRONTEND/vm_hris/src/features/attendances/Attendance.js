import React, { memo, useEffect, useState } from "react";
import { format } from "date-fns";
import { Button, Modal, Table, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import {
  useGetDocumentsQuery,
  useGetGeninfosQuery,
} from "../employeerecords/recordsApiSlice";
import { PDFDocument } from "pdf-lib";

const Attendance = ({ att, attlogData }) => {
  const [dateTo, setDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");

  // Fetch document using document name (filename)
  const { document } = useGetDocumentsQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      document: data?.ids
        ?.filter(
          (id) =>
            data?.entities?.[id]?.filename.toString() === "reg-probi_time_sheet"
        )
        .map((id) => data?.entities[id])[0],
    }),
  });

  // Fetch general info using Bio ID
  const { geninfo } = useGetGeninfosQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      geninfo: data?.ids
        .filter(
          (id) => data.entities[id].BioID.toString() === att.bioId.toString()
        )
        .map((id) => data.entities[id])[0],
    }),
  });

  const [matchingAtt, setMatchingAtt] = useState([]);

  const [show, setShow] = useState(false);

  const [startSlice, setStartSlice] = useState(0);
  const [endSlice, setEndSlice] = useState(10);

  const handleClose = () => setShow(false);

  const handlePrintAtt = async () => {
    try {
      const formUrl = `data:application/pdf;base64,${document?.data}`;
      const formPdfBytes = await fetch(formUrl).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(formPdfBytes);
      const form = pdfDoc.getForm();

      const EmployeeName = form.getTextField("EmployeeName");
      const BioID = form.getTextField("BioID");
      const DepartmentBranch = form.getTextField("DepartmentBranch");
      const Position = form.getTextField("Position");
      const PrintDateTime = form.getTextField("PrintDateTime");
      const PeriodCovered = form.getTextField("PeriodCovered");

      // Set value to text fields
      EmployeeName.setText(
        `${geninfo.LastName}, ${geninfo.FirstName} ${geninfo.MI}`
      );
      BioID.setText(`(${geninfo.BioID.toString()})`);
      DepartmentBranch.setText(geninfo.AssignedOutlet);
      Position.setText(geninfo.JobTitle);
      PrintDateTime.setText(format(new Date(), "eeee, MMMM dd, yyyy @ pp"));
      PeriodCovered.setText("sample");

      const pdfBytes = await pdfDoc.save();

      const modifiedPdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);

      // window.open(modifiedPdfUrl, "_blank");

      const dateFrom = new Date("03/02/2023").getTime(); // Example date from
      const dateTo = new Date("03/05/2023").getTime(); // Example date to

      const filteredData = matchingAtt.filter((obj) => {
        const date = new Date(obj.date).getTime();

        return date >= dateFrom && date <= dateTo;
      });

      console.log(filteredData); // Output: Filtered array based on date range
    } catch (error) {
      console.error("handlePrintAtt error - ", error);
    }
  };

  const tableContent = matchingAtt?.length
    ? matchingAtt.slice(startSlice, endSlice).map((att, index) => (
        <tr key={index}>
          <td>{att.date}</td>
          <td>{att.checkIn}</td>
          <td>{att.breakIn}</td>
          <td>{att.breakOut}</td>
          <td>{att.checkOut}</td>
        </tr>
      ))
    : null;

  const handleShowModal = () => {
    const tempAttData = [];

    try {
      attlogData
        .filter((line) => {
          const [bioId, datetime, val1, val2, val3, val4] = line.split("\t"); // eslint-disable-line no-unused-vars

          return String(bioId) === String(att.bioId);
        })
        .forEach((line) => {
          const [bioId, datetime, val1, val2, val3, val4] = line.split("\t"); // eslint-disable-line no-unused-vars

          const formattedDate = format(new Date(datetime), "P");
          const formattedTime = format(new Date(datetime), "p");

          const existingLine = tempAttData.findIndex((e) => {
            return e.bioId === bioId && e.date === formattedDate;
          });

          if (existingLine !== -1) {
            if (val2 * 1 === 0) {
              tempAttData[existingLine] = {
                ...tempAttData[existingLine],
                checkIn: formattedTime,
              };
            } else if (val2 * 1 === 1) {
              tempAttData[existingLine] = {
                ...tempAttData[existingLine],
                checkOut: formattedTime,
              };
            } else if (val2 * 1 === 2) {
              tempAttData[existingLine] = {
                ...tempAttData[existingLine],
                breakIn: formattedTime,
              };
            } else if (val2 * 1 === 3) {
              tempAttData[existingLine] = {
                ...tempAttData[existingLine],
                breakOut: formattedTime,
              };
            }
          } else {
            tempAttData.push({
              bioId: bioId,
              date: formattedDate,
              checkIn: val2 * 1 === 0 ? formattedTime : "",
              checkOut: val2 * 1 === 1 ? formattedTime : "",
              breakIn: val2 * 1 === 2 ? formattedTime : "",
              breakOut: val2 * 1 === 3 ? formattedTime : "",
            });
          }
        });
    } catch (error) {
      console.error(`handleShowModal Error: ${error}`);
    }

    setMatchingAtt(tempAttData);
    setShow(true);
  };

  useEffect(() => {
    if (dateTo !== "" || dateFrom !== "") {
      try {
        const filteredAtt = matchingAtt.filter((att) => {
          const dateToCompare = new Date(
            format(new Date(att.date), "yyyy-MM-dd")
          ).getTime();
          const formattedDateTo = new Date("03/05/2023").getTime();
          const formattedDateFrom = new Date("03/20/2023").getTime();

          console.log(dateToCompare >= formattedDateFrom);
          console.log(dateToCompare <= formattedDateTo);

          return (
            dateToCompare >= formattedDateFrom &&
            dateToCompare <= formattedDateTo
          );
        });

        console.log(filteredAtt);
      } catch (error) {
        console.error(error);
      }
    }
  }, [dateTo, dateFrom, matchingAtt]);

  if (att) {
    return (
      <>
        <tr key={att.bioId} onClick={handleShowModal}>
          <td>{att.bioId}</td>
          <td>{att.name}</td>
        </tr>
        <>
          <Modal show={show} onHide={handleClose} scrollable>
            <Modal.Header closeButton>{att.name}'s Attendance </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover>
                <thead>
                  <tr className="align-middle">
                    <th>Date</th>
                    <th>Time-In</th>
                    <th>Break-In</th>
                    <th>Break-Out</th>
                    <th>Time-Out</th>
                  </tr>
                </thead>
                <tbody>{tableContent}</tbody>
                <tfoot>
                  <tr>
                    <td className="fw-bold" colSpan={1}>
                      Filter by Date:
                    </td>
                    <td colSpan={2}>
                      <Form>
                        <Form.Group>
                          <Form.Label className="fw-bold">Date From</Form.Label>
                          <Form.Control
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                          />
                        </Form.Group>
                      </Form>
                    </td>
                    <td colSpan={2}>
                      <Form>
                        <Form.Group>
                          <Form.Label className="fw-bold">Date To</Form.Label>
                          <Form.Control
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                          />
                        </Form.Group>
                      </Form>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-primary" onClick={handlePrintAtt}>
                <FontAwesomeIcon icon={faPrint} />
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setStartSlice((prev) => prev - 10);
                  setEndSlice((prev) => prev - 10);
                }}
                disabled={startSlice === 0}
              >
                Prev
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setStartSlice((prev) => prev + 10);
                  setEndSlice((prev) => prev + 10);
                }}
                disabled={endSlice >= matchingAtt?.length}
              >
                Next
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      </>
    );
  } else return null;
};

const memoizedAttendance = memo(Attendance);

export default memoizedAttendance;
