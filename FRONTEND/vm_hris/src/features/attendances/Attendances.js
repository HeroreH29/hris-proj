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
import {
  useAddNewAttendanceMutation,
  useGetAttendanceDataQuery,
  useGetCasualRatesQuery,
  useUpdateAttendanceMutation,
} from "./attendancesApiSlice";
import { faPrint, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PDFDocument } from "pdf-lib";
import { differenceInDays } from "date-fns";
import useAuth from "../../hooks/useAuth";
import useTableSettings from "../../hooks/useTableSettings";
import AttendanceModal from "../../modals/AttendanceModal";
import useAttModalSettings from "../../hooks/useAttModalSettings";
import AttLogProcessor from "./AttLogProcessor";

const Attendances = () => {
  const { attListProcessor, pdfListProcessor } = AttLogProcessor();
  const { isX } = useAuth();
  useTitle("Attendances | Via Mare HRIS");

  const { tableState, tableDispatch } = useTableSettings();
  const { attModalState, attModalDispatch } = useAttModalSettings();

  // Casual rate data
  const { casualrates } = useGetCasualRatesQuery("", {
    selectFromResult: ({ data }) => ({
      casualrates: data?.ids?.map((id) => data?.entities[id])[0],
    }),
  });

  const [validated, setValidated] = useState(false);

  const [attList, setAttList] = useState([]);
  const [attlogData, setAttlogData] = useState(undefined);

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
    isError: attdataError,
    error: attdataerr,
  } = useGetAttendanceDataQuery();

  const [addAttData, { isError: addattError, error: addatterr }] =
    useAddNewAttendanceMutation();

  const [updateAttData, { isError: updateattError, error: updateatterr }] =
    useUpdateAttendanceMutation();

  // attdata error checker
  useEffect(() => {
    if (attdataError) {
      toast.warn(attdataerr.data.message, {
        toastId: "attdata-err",
        containerId: "A",
      });
    }
  }, [attdataError]);

  // Add or update att data error checker
  useEffect(() => {
    if (addattError || updateattError) {
      toast.error(addatterr.data.message ?? updateatterr.data.message, {
        containerId: "A",
        toastId: "add-update-att-error",
      });
    }
  }, [addattError, addatterr, updateattError, updateatterr]);

  if (genLoading && attdataLoading) return <Spinner animation="border" />;

  // Function for attlog uploading
  const AttlogFileUpload = (file) => {
    if (!file) return;

    // Check if the uploaded file is an 'attlog.dat' file
    if (file.name.includes("attlog.dat") && genSuccess) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const uploadedRawAttData = event.target.result;

        if (!attdata?.ids.length) {
          const addPromise = new Promise((resolve) => {
            resolve(
              addAttData({
                attlogName: file.name,
                data: uploadedRawAttData,
              })
            );
          });

          toast.promise(
            addPromise,
            {
              pending: "Uploading attendance data...",
              success: "Attendance data uploaded!",
              error: "Attendance data failed to upload!",
            },
            {
              containerId: "A",
            }
          );
        } else {
          const { ids: attids, entities: attentities } = attdata;

          const currRawAttData = attids.map((id) => {
            return attentities[id].data;
          });

          const mergedAttData = currRawAttData[0] + "\n" + uploadedRawAttData;
          const updatePromise = new Promise((resolve) => {
            resolve(
              updateAttData({
                id: attids[0],
                attlogName: file.name,
                data: mergedAttData,
              })
            );
          });

          toast.promise(
            updatePromise,
            {
              pending: "Updating existing attendance data...",
              success: "Attendance data updated!",
              error: "Failed updating attendance data!",
            },
            { containerId: "A" }
          );
        }
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

      const attlistPromise = attListProcessor(
        genids,
        genentities,
        fileContents[0],
        setAttlogData
      );

      setAttList([]);
      /* setAttList(
        attListProcessor(genids, genentities, fileContents[0], setAttlogData)
      ); */
      toast
        .promise(
          attlistPromise,
          {
            pending: "Attendance loading...",
            success: "Attendance loaded!",
            error: "Attendance failed to load!",
          },
          { containerId: "A" }
        )
        .then((result) => {
          setAttList(result);
        })
        .catch((error) => {
          console.log("Attendance load error: ", error);
        });
    }
  };

  const handleNextPage = () => {
    tableDispatch({ type: "slice_inc" });
  };

  const handlePrevPage = () => {
    tableDispatch({ type: "slice_dec" });
  };

  const handlePrintBranchAttendance = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const daysDiff =
      differenceInDays(
        new Date(attModalState.dateTo),
        new Date(attModalState.dateFrom)
      ) + 1;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (daysDiff > 15) {
      return toast.warn("Selected date range is more than 15 days", {
        containerId: "A",
      });
    }

    // Reset date values and close modal
    attModalDispatch({ type: "close_modal" });

    // Every attendance record per employee will generate a time sheet PDF
    const generatedPdfs = await Promise.all(
      filteredList.map((att) =>
        pdfListProcessor(att, attlogData, geninfos, attModalState, casualrates)
      )
    );

    // After generation, collate the PDFs into one document
    if (generatedPdfs.length > 0) {
      const mainDoc = await PDFDocument.create();
      for (const pdf of generatedPdfs) {
        const pdfDoc = await PDFDocument.load(pdf);
        const [existingPage] = await mainDoc.copyPages(pdfDoc, [0]);
        mainDoc.insertPage(0, existingPage);
      }

      // Open a new browser tab to show the collated PDFs
      const modifiedPdfBlob = await mainDoc.save();
      const modifiedPdfUrl = URL.createObjectURL(
        new Blob([modifiedPdfBlob], { type: "application/pdf" })
      );

      if (modifiedPdfUrl) {
        toast.success("Time sheets generated!");
        window.open(modifiedPdfUrl, "_blank");
      }
    }

    setValidated(false);
  };

  const filteredList = attList?.filter((att) => {
    let matches = true;

    if (tableState.outletFilter !== "") {
      matches = matches && att?.outlet === tableState.outletFilter;
    }

    if (tableState.empTypeFilter !== "") {
      matches = matches && att?.empType === tableState.empTypeFilter;
    }

    return matches;
  });

  const tableContent = filteredList
    ?.sort((a, b) => {
      return a.name?.localeCompare(b.name);
    })
    .slice(tableState.sliceStart, tableState.sliceEnd)
    .map((att) => (
      <Attendance key={att.bioId} att={att} attlogData={attlogData} />
    ));

  return (
    <Container>
      {/* Title and attendance load button */}
      <Row>
        <Col>
          <h3>Attendances</h3>
        </Col>
        <Col md="auto">
          <Button
            variant="outline-success"
            disabled={!attdata?.ids.length}
            onClick={() => handleAttlistRefresh()}
          >
            Load attendance
            <FontAwesomeIcon className="ms-2" icon={faRefresh} />
          </Button>
        </Col>
      </Row>
      {/* File upload area */}
      <Row className="p-2">
        <Form.Group className="mb-3">
          <Form.Label>Upload attlog file here:</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => AttlogFileUpload(e.target.files[0])}
          />
        </Form.Group>
      </Row>
      {/* Table */}
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
      {/* Outlet and employee type filter */}
      <Row className="p-2">
        <Form.Group as={Col}>
          <Form.Select
            disabled={attList?.length === 0 || isX.isOutletProcessor}
            onChange={(e) => {
              tableDispatch({
                type: "outlet_filter",
                outletFilter: e.target.value,
              });
            }}
            placeholder="Select outlet..."
            value={tableState.outletFilter}
          >
            {outletOptions}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Select
            disabled={attList?.length === 0}
            onChange={(e) => {
              tableDispatch({
                type: "emptype_filter",
                empTypeFilter: e.target.value,
              });
            }}
            placeholder="Select type..."
            value={tableState.empTypeFilter}
          >
            {empTypeOptions}
          </Form.Select>
        </Form.Group>
        {tableState.outletFilter && tableState.empTypeFilter && (
          <Col md="auto">
            <Button
              className="float-end"
              variant="outline-success"
              onClick={() => attModalDispatch({ type: "show_modal" })}
            >
              {`Print ${tableState.outletFilter} (${tableState.empTypeFilter}) -> `}
              <FontAwesomeIcon icon={faPrint} />
            </Button>
          </Col>
        )}
        <Col>
          <Button
            variant="outline-primary float-end"
            onClick={handleNextPage}
            disabled={tableState.sliceEnd >= filteredList?.length}
          >
            Next
          </Button>
          <Button
            variant="outline-primary float-end me-3"
            onClick={handlePrevPage}
            disabled={tableState.sliceStart === 0}
          >
            Prev
          </Button>
        </Col>
      </Row>

      {/* Branch attendance date range printing modal */}
      <AttendanceModal
        attModalState={attModalState}
        attModalDispatch={attModalDispatch}
        setValidated={setValidated}
        tableState={tableState}
        validated={validated}
        handlePrintBranchAttendance={handlePrintBranchAttendance}
      />
    </Container>
  );
};

export default Attendances;
