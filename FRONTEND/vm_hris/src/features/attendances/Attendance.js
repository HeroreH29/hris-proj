import React, { memo, useState } from "react";
import { format, parse } from "date-fns";
import { Button, Modal, Table, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import {
  useGetDocumentsQuery,
  useGetGeninfosQuery,
} from "../employeerecords/recordsApiSlice";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { toast } from "react-toastify";
import AttendanceModal from "../../modals/AttendanceModal";
import getDatesInBetween from "./getDatesInBetween";
import useAttModalSettings from "../../hooks/useAttModalSettings";
import useTableSettings from "../../hooks/useTableSettings";

const Attendance = ({ att, attlogData }) => {
  const { state, dispatch } = useAttModalSettings();
  const { state: tableState, dispatch: tableDispatch } = useTableSettings();
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

  const [showModal, setShowModal] = useState(false);

  const [startSlice, setStartSlice] = useState(0);
  const [endSlice, setEndSlice] = useState(10);

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
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 8.5;

      // Function to find fields on the document
      const FieldFinder = (fieldName, altFieldName) => {
        let row = form.getFieldMaybe(fieldName);
        if (!row) {
          row = form.getField(altFieldName);
        }
        let rowName = row.getName();
        return form.getTextField(rowName);
      };

      const EmployeeName = FieldFinder(
        "EmployeeName",
        "undefined.EmployeeName"
      );
      const BioID = FieldFinder("BioID", "undefined.BioID");
      const DepartmentBranch = FieldFinder(
        "DepartmentBranch",
        "undefined.DepartmentBranch"
      );
      const Position = FieldFinder("Position", "undefined.Position");
      const PrintDateTime = FieldFinder(
        "PrintDateTime",
        "undefined.PrintDateTime"
      );
      const PeriodCovered = FieldFinder(
        "PeriodCovered",
        "undefined.PeriodCovered"
      );

      // Set value to text fields
      EmployeeName.setText(
        `${geninfo.LastName}, ${geninfo.FirstName} ${geninfo.MI}`
      );
      EmployeeName.updateAppearances(helveticaBold);
      BioID.setText(`(${geninfo.BioID.toString()})`);
      BioID.updateAppearances(helveticaBold);
      DepartmentBranch.setText(
        `${geninfo.Department} - ${geninfo.AssignedOutlet}`
      );
      DepartmentBranch.updateAppearances(helveticaBold);
      Position.setText(geninfo.JobTitle);
      Position.updateAppearances(helveticaBold);
      PrintDateTime.setText(format(new Date(), "eeee, MMMM dd, yyyy @ pp"));
      PeriodCovered.setText(
        `${format(new Date(dateFrom), "MMM dd")} - ${format(
          new Date(dateTo),
          "MMM dd yyyy"
        )}`
      );

      // Copy of dates array returned from GetDatesInBetween()
      const dateArr = getDatesInBetween(dateFrom, dateTo);

      // Check if document requested is appropriate based on employee type and length of dateArr
      if (geninfo.EmployeeType === "Casual" && dateArr?.length > 7) {
        alert(
          `Most # of days required for Casual Time Sheet is 7 days. Requested is ${dateArr?.length} days. Double check your dates!`
        );
        return;
      }

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
        DAYSRow.setFontSize(fontSize - 1);

        const TimeInRow = FieldFinder(
          `Time InRow${index + 1}`,
          `undefined.Time InRow${index + 1}`
        );
        TimeInRow.setFontSize(fontSize);

        const TimeOutRow = FieldFinder(
          `Time OutRow${index + 1}`,
          `undefined.Time OutRow${index + 1}`
        );
        TimeOutRow.setFontSize(fontSize);

        const BreakInRow = FieldFinder(
          `Break InRow${index + 1}`,
          `undefined.Break InRow${index + 1}`
        );
        BreakInRow.setFontSize(fontSize);

        const BreakOutRow = FieldFinder(
          `Break OutRow${index + 1}`,
          `undefined.Break OutRow${index + 1}`
        );
        BreakOutRow.setFontSize(fontSize);

        // If an index is found...
        if (attIndex !== -1) {
          // Days rows set text
          DAYSRow.setText(
            format(new Date(filteredAtt[attIndex].date), "dd-eee")
          );

          // Time in and time out rows set text
          if (filteredAtt[attIndex].checkIn !== "" && TimeInRow) {
            TimeInRow.setText(`${filteredAtt[attIndex].checkIn}`);
          }
          if (filteredAtt[attIndex].checkOut !== "" && TimeOutRow) {
            TimeOutRow.setText(`${filteredAtt[attIndex].checkOut}`);
          }

          // Break in and break out rows set text
          BreakInRow.setText(filteredAtt[attIndex].breakIn);
          BreakOutRow.setText(filteredAtt[attIndex].breakOut);
        } else {
          DAYSRow.setText(format(new Date(date), "dd-eee"));
        }
        DAYSRow.updateAppearances(helveticaBold);
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
      : matchingAtt;

  // JSX variable for table body
  const tableContent =
    filteredAtt?.length &&
    filteredAtt
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

          const formattedDate = format(new Date(datetime), "M/d/yyyy");
          const formattedTime = format(new Date(datetime), "p");

          const existingIndex = tempAttData.findIndex((e) => {
            return e.date === formattedDate;
          });

          // Line does not exist
          if (existingIndex === -1) {
            /* Check first if the next line with a new date is a check out entry.
            This just means that the employee has checked out on the following day */
            const parsedFormattedTime = parse(formattedTime, "p", new Date());
            const attTimeCutOff = new Date(new Date().setHours(4, 0, 0));
            if (
              val2 * 1 === 1 &&
              parsedFormattedTime.getHours() <= attTimeCutOff.getHours()
            ) {
              let prevDayAtt = tempAttData[tempAttData?.length - 1];
              if (!prevDayAtt?.checkOut) {
                prevDayAtt = {
                  ...prevDayAtt,
                  checkOut: `${formattedDate} ${formattedTime}`,
                  additionalDate: `${formattedDate} ${formattedTime}`,
                };

                tempAttData[tempAttData?.length - 1] = prevDayAtt;
              }
            } else {
              tempAttData.push({
                bioId: bioId,
                date: formattedDate,
                checkIn:
                  val2 * 1 === 0 ? `${formattedDate} ${formattedTime}` : "",
                checkOut:
                  val2 * 1 === 1 ? `${formattedDate} ${formattedTime}` : "",
                breakIn: val2 * 1 === 2 ? formattedTime : "",
                breakOut: val2 * 1 === 3 ? formattedTime : "",
              });
            }
          } else {
            if (val2 * 1 === 1) {
              tempAttData[existingIndex] = {
                ...tempAttData[existingIndex],
                checkOut: `${formattedDate} ${formattedTime}`,
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
        });
    } catch (error) {
      console.error(`handleShowModal Error: ${error}`);
    }
    setMatchingAtt(tempAttData);
    setShowModal(true);
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
          <AttendanceModal
            showModal={showModal}
            setShowModal={setShowModal}
            attModalState={state}
            attModalDispatch={dispatch}
            tableContent={tableContent}
            handlePrintAtt={handlePrintAtt}
            tableState={tableState}
            tableDispatch={tableDispatch}
            filteredAtt={filteredAtt}
            matchingAtt={matchingAtt}
            att={att}
          />
        </>
      </>
    );
  } else return null;
};

const memoizedAttendance = memo(Attendance);

export default memoizedAttendance;
