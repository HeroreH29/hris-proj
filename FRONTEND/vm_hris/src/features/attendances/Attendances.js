import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Form,
  Spinner,
  Modal,
} from "react-bootstrap";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import Attendance from "./Attendance";
import useTitle from "../../hooks/useTitle";
import { toast } from "react-toastify";
import { ASSIGNEDOUTLET, EMPLOYEETYPE } from "../../config/gInfoOptions";
import {
  useAddNewAttendanceMutation,
  useGetAttendanceDataQuery,
  useUpdateAttendanceMutation,
} from "./attendancesApiSlice";
import { useGetDocumentsQuery } from "../employeerecords/recordsApiSlice";
import { faPrint, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { format, parse } from "date-fns";

const Attendances = () => {
  useTitle("Attendances | Via Mare HRIS");

  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);

  const [attList, setAttList] = useState([]);
  const [attlogData, setAttlogData] = useState(undefined);

  const [startSlice, setStartSlice] = useState(0);
  const [endSlice, setEndSlice] = useState(20);

  const [outletFilter, setOutletFilter] = useState("");
  const [empTypeFilter, setEmpTypeFilter] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
  } = useGetGeninfosQuery();

  const {
    data: attdata,
    isSuccess: attdataSuccess,
    isLoading: attdataLoading,
  } = useGetAttendanceDataQuery();

  const [addAttData, { isError: addattError, error: addatterr }] =
    useAddNewAttendanceMutation();

  const [updateAttData, { isError: updateattError, error: updateatterr }] =
    useUpdateAttendanceMutation();

  // Fetch document using document name (filename)
  const { documents } = useGetDocumentsQuery("recordsList", {
    selectFromResult: ({ data }) => ({
      documents: data?.ids?.map((id) => data?.entities[id]),
    }),
  });

  // Function for processing attlog data
  const ProcessAttlog = (ids, entities, fileContents) => {
    const lines = fileContents.split("\n").map((line) => line.trim());
    setAttlogData(lines);

    const tempAttList = [];

    try {
      lines.forEach((line) => {
        const [bioId, datetime, val1, val2, val3, val4] = line.split("\t"); // eslint-disable-line no-unused-vars

        if (bioId !== "1") {
          const matchedRecord = ids
            .filter((id) => {
              return (
                String(entities[id].BioID) === String(bioId) &&
                entities[id].EmpStatus === "Y"
              );
            })
            .map((id) => entities[id])[0];

          const existingLine = tempAttList.findIndex((e) => {
            return String(e.bioId) === String(bioId);
          });

          if (existingLine === -1) {
            const fullname = `${matchedRecord?.LastName}, ${
              matchedRecord?.FirstName
            } ${matchedRecord?.MI ? matchedRecord.MI : ""}`;
            tempAttList.push({
              bioId: bioId,
              name: fullname,
              outlet: matchedRecord?.AssignedOutlet,
              empType: matchedRecord?.EmployeeType,
            });
          }
        }
      });
    } catch (error) {
      console.error(`ProcessAttlog() Error: ${error}`);
    }

    return tempAttList;
  };

  useEffect(() => {
    if (attList?.length > 0) {
      toast.success("Attendance logs loaded!");
    }
  }, [attList]);

  useEffect(() => {
    if (addattError || updateattError) {
      console.log(addatterr);
      console.log(updateatterr);
    }
  }, [addattError, addatterr, updateattError, updateatterr]);

  if (genLoading && attdataLoading) return <Spinner animation="border" />;

  // Function for attlog uploading
  const AttlogFileUpload = (file) => {
    // Check if the uploaded file is an 'attlog.dat' file
    if (file.name.includes("attlog.dat") && genSuccess) {
      const reader = new FileReader();

      const { ids, entities } = geninfos;

      reader.onload = async (event) => {
        const fileContents = event.target.result;

        /* Upload file contents to database if data is not yet existing.
        Else, append the data into the existing file */
        if (!attdata) {
          await addAttData({
            attlogName: file.name,
            data: fileContents,
          });
        } else {
          const { ids } = attdata;
          await updateAttData({
            id: ids[0],
            attlogName: file.name,
            data: fileContents,
          });
        }

        // Process the fetched attlog data
        const attlogList = ProcessAttlog(ids, entities, fileContents);

        setAttList(attlogList);
      };
      reader.readAsText(file);
    }
  };

  const handleAttlistRefresh = () => {
    if (attdataSuccess && genSuccess) {
      const { ids: genids, entities: genentities } = geninfos;
      const { ids: attids, entities: attentities } = attdata;

      const fileContents = attids.map((id) => {
        return attentities[id].data;
      });

      setAttList([]);
      setAttList(ProcessAttlog(genids, genentities, fileContents[0]));
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

  const processAttData = async (att) => {
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
      console.error(`processAttData Error: ${error}`);
    }

    // For filtering attendance (if date range has been set by user)
    const filteredAtt =
      startDate !== "" && endDate !== ""
        ? tempAttData.filter((att) => {
            const dateToCompare = new Date(att.date).valueOf();
            const formattedFrom = new Date(
              format(new Date(startDate), "MM/dd/yyyy")
            ).valueOf();
            const formattedTo = new Date(
              format(new Date(endDate), "MM/dd/yyyy")
            ).valueOf();

            return (
              dateToCompare >= formattedFrom && dateToCompare <= formattedTo
            );
          })
        : tempAttData;

    const geninfo = geninfos.ids
      .filter(
        (id) => String(geninfos.entities[id]?.BioID) === String(att.bioId)
      )
      .map((id) => geninfos.entities[id])[0];

    const generatedPdf = await generatePdf(geninfo, filteredAtt);

    return generatedPdf;
  };

  const generatePdf = async (geninfo, filteredAtt) => {
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
        `${geninfo.LastName}, ${geninfo.FirstName} ${
          geninfo.MI ? geninfo.MI : ""
        }`
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
        `${format(new Date(startDate), "MMM dd")} - ${format(
          new Date(endDate),
          "MMM dd yyyy"
        )}`
      );

      // Copy of dates array returned from GetDatesInBetween()
      const dateArr = GetDatesInBetween(startDate, endDate);

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

      return pdfBytes;

      /* const modifiedPdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);

      toast.success("Time sheet generated!");
      window.open(modifiedPdfUrl, "_blank"); */
    } catch (error) {
      console.error("geenratePdf error - ", error);
    }
  };

  const handlePrintBranchAttendance = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
    } else {
      // Every attendance record per employee will generate a time sheet pdf
      const generatedPdfs = [];
      if (filteredList && filteredList.length > 0) {
        await Promise.all(
          filteredList.map(async (att) => {
            const generatedPdf = await processAttData(att);
            generatedPdfs.push(generatedPdf);
          })
        );
      }

      // After generation, it will be collated in one pdf (1 time sheet per page)
      if (generatedPdfs?.length > 0) {
        const mainDoc = await PDFDocument.create();
        await Promise.all(
          generatedPdfs.map(async (pdf) => {
            const pdfDoc = await PDFDocument.load(pdf);
            const [existingPage] = await mainDoc.copyPages(pdfDoc, [0]);
            mainDoc.insertPage(0, existingPage);
          })
        );

        // Open new browser tab to show the collated PDFs
        const modifiedPdfBlob = await mainDoc.save();
        const modifiedPdfUrl = URL.createObjectURL(
          new Blob([modifiedPdfBlob], {
            type: "application/pdf",
          })
        );

        toast.success("Time sheets generated!");
        window.open(modifiedPdfUrl, "_blank");
      }
    }

    setValidated(true);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3>Attendances</h3>
        </Col>
        <Col md="auto">
          <Button
            variant="outline-success"
            onClick={() => handleAttlistRefresh()}
          >
            Load attendance
            <FontAwesomeIcon className="ms-2" icon={faRefresh} />
          </Button>
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
        {outletFilter && empTypeFilter && (
          <Col md="auto">
            <Button
              className="float-end"
              variant="outline-success"
              onClick={() => setShowModal(true)}
            >
              {`Print ${outletFilter} (${empTypeFilter}) -> `}
              <FontAwesomeIcon icon={faPrint} />
            </Button>
          </Col>
        )}
        <Col>
          <Button
            variant="outline-primary float-end"
            onClick={handleNextPage}
            disabled={endSlice >= filteredList?.length}
          >
            Next
          </Button>
          <Button
            variant="outline-primary float-end me-3"
            onClick={handlePrevPage}
            disabled={startSlice === 0}
          >
            Prev
          </Button>
        </Col>
      </Row>

      {/* Branch attendance date range printing modal */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setStartDate("");
          setEndDate("");
          setValidated(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{`Print ${outletFilter} (${empTypeFilter}) Attendance`}</Modal.Title>
        </Modal.Header>
        <Form
          noValidate
          validated={validated}
          onSubmit={handlePrintBranchAttendance}
        >
          <Modal.Body>
            <Form.Group className="mb-2" as={Col}>
              <Form.Label className="fw-semibold">Date from:</Form.Label>
              <Form.Control
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Choose a date
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2" as={Col}>
              <Form.Label className="fw-semibold">Date until:</Form.Label>
              <Form.Control
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Choose a date
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-warning"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline-success"
              type="submit"
              onClick={handlePrintBranchAttendance}
            >
              Proceed
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Attendances;
