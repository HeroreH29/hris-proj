import React, { memo, useState } from "react";
import { format, parse } from "date-fns";
import { Button, Modal, Table, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import {
  useGetDocumentsQuery,
  useGetGeninfosQuery,
} from "../employeerecords/recordsApiSlice";
import { PDFDocument } from "pdf-lib";
import { toast } from "react-toastify";

const Attendance = ({ att, attlogData }) => {
  const [dateTo, setDateTo] = useState("");
  const [dateFrom, setDateFrom] = useState("");

  // Fetch document using document name (filename)
  const { documents } = useGetDocumentsQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      documents: data?.ids?.map((id) => data?.entities[id]),
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

  // Modal close event
  const handleClose = () => {
    setShow(false);
    setDateFrom("");
    setDateTo("");
    setStartSlice(0);
    setEndSlice(10);
  };

  // Generation of dates for attendance printing
  const GetDatesInBetween = (date1, date2) => {
    const dateFrom = new Date(date1);
    const dateTo = new Date(date2);

    const dates = [];
    let currentDate = new Date(dateFrom);

    while (currentDate <= dateTo) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Printing attendance function
  const handlePrintAtt = async () => {
    let filename;

    // Determine if the employee type is regular/probationary or casual to change which document to pull
    if (geninfo.EmployeeType !== "Casual") {
      filename = "reg-probi_time_sheet";
    } else {
      filename = "casual_time_sheet";
    }

    // Find the specific document from the fetched documents data from the database
    const doc = documents.find((document) => document.filename === filename);

    // Proceed in generating the document with the employee and attendance data
    try {
      const formUrl = `data:application/pdf;base64,${doc?.data}`;
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
      DepartmentBranch.setText(
        `${geninfo.Department} - ${geninfo.AssignedOutlet}`
      );
      Position.setText(geninfo.JobTitle);
      PrintDateTime.setText(format(new Date(), "eeee, MMMM dd, yyyy @ pp"));
      PeriodCovered.setText(
        `${format(new Date(dateFrom), "MMM dd")} - ${format(
          new Date(dateTo),
          "MMM dd yyyy"
        )}`
      );

      // Copy of dates array returned from GetDatesInBetween()
      const dateArr = GetDatesInBetween(dateFrom, dateTo);

      // Check if document requested is appropriate based on employee type and length of dateArr
      if (geninfo.EmployeeType === "Casual" && dateArr?.length > 7) {
        alert(
          `Most # of days required for Casual Time Sheet is 7 days. Requested is ${dateArr?.length} days. Double check your dates!`
        );
        return;
      }

      // Function to find fields on the document
      const FieldFinder = (fieldName, altFieldName) => {
        let row = form.getFieldMaybe(fieldName);
        if (!row) {
          row = form.getField(altFieldName);
        }
        let rowName = row.getName();
        return form.getTextField(rowName);
      };

      dateArr.forEach((date, index) => {
        /* NOTE: the text field names suddenly had 'undefined' included before
        actual field name after editing in Nitro Pro 9 so i created
        FieldFinder() to fix that issue somehow */

        // For finding specific index of the filtered attendance data
        const attIndex = filteredAtt.findIndex(
          (att) =>
            new Date(att.date).valueOf() ===
            new Date(format(date, "MM/dd/yyyy")).valueOf()
        );

        const DAYSRow = FieldFinder(
          `DAYSRow${index + 1}`,
          `undefined.DAYSRow${index + 1}`
        );

        const TimeInRow = FieldFinder(
          `Time InRow${index + 1}`,
          `undefined.Time InRow${index + 1}`
        );

        const TimeOutRow = FieldFinder(
          `Time OutRow${index + 1}`,
          `undefined.Time OutRow${index + 1}`
        );

        const BreakInRow = FieldFinder(
          `Break InRow${index + 1}`,
          `undefined.Break InRow${index + 1}`
        );
        const BreakOutRow = FieldFinder(
          `Break OutRow${index + 1}`,
          `undefined.Break OutRow${index + 1}`
        );

        // If an index is found...
        if (attIndex !== -1) {
          // Days rows set text
          DAYSRow.setText(
            format(new Date(filteredAtt[attIndex].date), "dd-eee")
          );

          // Time in and time out rows set text
          if (filteredAtt[attIndex].checkIn !== "" && TimeInRow) {
            TimeInRow.setText(
              `${filteredAtt[attIndex].date} ${filteredAtt[attIndex].checkIn}`
            );
          }
          if (filteredAtt[attIndex].checkOut !== "" && TimeOutRow) {
            TimeOutRow.setText(
              `${
                filteredAtt[attIndex]?.additionalDate ||
                filteredAtt[attIndex].date
              } ${filteredAtt[attIndex].checkOut}`
            );
          }

          // Break in and break out rows set text
          BreakInRow.setText(filteredAtt[attIndex].breakIn);
          BreakOutRow.setText(filteredAtt[attIndex].breakOut);
        } else {
          DAYSRow.setText(format(new Date(date), "dd-eee"));
        }
      });

      const pdfBytes = await pdfDoc.save();

      const modifiedPdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);

      toast.success("Time sheet generated!");
      window.open(modifiedPdfUrl, "_blank");
    } catch (error) {
      console.error("handlePrintAtt error - ", error);
    }
  };

  // For filtering attendance (if date range has been set by user)
  const filteredAtt =
    dateFrom !== "" && dateTo !== ""
      ? matchingAtt.filter((att) => {
          const dateToCompare = new Date(att.date).valueOf();
          const formattedFrom = new Date(
            format(new Date(dateFrom), "MM/dd/yyyy")
          ).valueOf();
          const formattedTo = new Date(
            format(new Date(dateTo), "MM/dd/yyyy")
          ).valueOf();

          return dateToCompare >= formattedFrom && dateToCompare <= formattedTo;
        })
      : [];

  // JSX variable for table body
  const tableContent = filteredAtt?.length
    ? filteredAtt
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          return dateB - dateA;
        })
        .slice(startSlice, endSlice)
        .map((att, index) => (
          <tr key={index}>
            <td>{att.date}</td>
            <td>{att.checkIn}</td>
            <td>{att.breakIn}</td>
            <td>{att.breakOut}</td>
            <td>{att.checkOut}</td>
          </tr>
        ))
    : matchingAtt
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          return dateB - dateA;
        })
        .slice(startSlice, endSlice)
        .map((att, index) => (
          <tr key={index}>
            <td>{att.date}</td>
            <td>{att.checkIn}</td>
            <td>{att.breakIn}</td>
            <td>{att.breakOut}</td>
            <td>{att.checkOut}</td>
          </tr>
        ));

  // Function for showing modal
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

          const existingIndex = tempAttData.findIndex((e) => {
            return e.bioId === bioId && e.date === formattedDate;
          });

          if (val2 * 1 === 1 && tempAttData[existingIndex].checkOut === "") {
          }

          if (existingIndex === -1) {
            tempAttData.push({
              bioId: bioId,
              date: formattedDate,
              checkIn: val2 * 1 === 0 ? formattedTime : "",
              checkOut: val2 * 1 === 1 ? formattedTime : "",
              breakIn: val2 * 1 === 2 ? formattedTime : "",
              breakOut: val2 * 1 === 3 ? formattedTime : "",
            });
          } else if (existingIndex !== -1) {
            if (val2 * 1 === 0) {
              tempAttData[existingIndex] = {
                ...tempAttData[existingIndex],
                checkIn: formattedTime,
              };
            } else if (val2 * 1 === 1) {
              tempAttData[existingIndex] = {
                ...tempAttData[existingIndex],
                checkOut: formattedTime,
              };
            } else if (val2 * 1 === 2) {
              tempAttData[existingIndex] = {
                ...tempAttData[existingIndex],
                breakIn: formattedTime,
              };
            } else if (val2 * 1 === 3) {
              tempAttData[existingIndex] = {
                ...tempAttData[existingIndex],
                breakOut: formattedTime,
              };
            }
          }

          // // Line does not exist
          // if (existingLine === -1) {
          //   /* Check first if the next line with a new date is a check out entry.
          //   This just means that the employee has checked out on the following day */
          //   const parsedFormattedTime = parse(formattedTime, "p", new Date());
          //   const attTimeCutOff = new Date(new Date().setHours(4, 0, 0));
          //   if (
          //     val2 * 1 === 1 &&
          //     parsedFormattedTime.getHours() <= attTimeCutOff.getHours()
          //   ) {
          //     let prevDayAtt = tempAttData[tempAttData?.length - 1];
          //     if (!prevDayAtt?.checkOut) {
          //       prevDayAtt = {
          //         ...prevDayAtt,
          //         checkOut: formattedTime,
          //         additionalDate: formattedDate,
          //       };

          //       tempAttData[tempAttData?.length - 1] = prevDayAtt;
          //     }
          //   }

          //   tempAttData.push({
          //     bioId: bioId,
          //     date: formattedDate,
          //     checkIn: val2 * 1 === 0 ? formattedTime : "",
          //     checkOut: val2 * 1 === 1 ? formattedTime : "",
          //     breakIn: val2 * 1 === 2 ? formattedTime : "",
          //     breakOut: val2 * 1 === 3 ? formattedTime : "",
          //   });
          // } else {
          //   // Line already exist
          //   if (val2 * 1 === 0) {
          //     tempAttData[existingLine] = {
          //       ...tempAttData[existingLine],
          //       checkIn: formattedTime,
          //     };
          //   } else if (val2 * 1 === 1) {
          //     tempAttData[existingLine] = {
          //       ...tempAttData[existingLine],
          //       checkOut: formattedTime,
          //     };
          //   } else if (val2 * 1 === 2) {
          //     tempAttData[existingLine] = {
          //       ...tempAttData[existingLine],
          //       breakIn: formattedTime,
          //     };
          //   } else if (val2 * 1 === 3) {
          //     tempAttData[existingLine] = {
          //       ...tempAttData[existingLine],
          //       breakOut: formattedTime,
          //     };
          //   }
          // }
        });
    } catch (error) {
      console.error(`handleShowModal Error: ${error}`);
    }

    setMatchingAtt(tempAttData);
    setShow(true);
  };

  // Check if attendance data is present
  if (att) {
    return (
      <>
        <tr key={att.bioId} onClick={handleShowModal}>
          <td>{att.bioId}</td>
          <td>{att.name}</td>
        </tr>
        <>
          <Modal show={show} onHide={handleClose} scrollable size="lg">
            <Modal.Header closeButton>
              {att.name}'s Attendance{" "}
              <span className="ms-1 fw-semibold">{` (${geninfo?.EmployeeType})`}</span>{" "}
            </Modal.Header>
            <Modal.Body>
              <Table striped bordered hover>
                <caption>{`(Pick date range before proceeding in printing)`}</caption>
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
                            value={dateFrom}
                            onChange={(e) => {
                              setDateFrom(e.target.value);
                              setStartSlice(0);
                            }}
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
                            value={dateTo}
                            onChange={(e) => {
                              setDateTo(e.target.value);
                              setEndSlice(10);
                            }}
                          />
                        </Form.Group>
                      </Form>
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-primary"
                onClick={handlePrintAtt}
                disabled={dateTo === "" && dateFrom === ""}
              >
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
                disabled={
                  filteredAtt?.length
                    ? endSlice >= filteredAtt?.length
                    : endSlice >= matchingAtt?.length
                }
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
