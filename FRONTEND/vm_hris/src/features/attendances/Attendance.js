import React, { memo, useState } from "react";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import { toast } from "react-toastify";
import AttendanceModal from "../../modals/AttendanceModal";
import useAttModalSettings from "../../hooks/useAttModalSettings";
import useTableSettings from "../../hooks/useTableSettings";
import GenerateTimeSheet from "./GenerateTimeSheet";
import getDatesInBetween from "./getDatesInBetween";
import { useGetCasualRatesQuery } from "./attendancesApiSlice";
import AttLogProcessor from "./AttLogProcessor";

const Attendance = ({ att, attlogData }) => {
  const { attModalState, attModalDispatch } = useAttModalSettings();
  const { tableState, tableDispatch } = useTableSettings();
  const { attDataFilterer, attDataProcessor } = AttLogProcessor();

  // Fetch general info using Bio ID
  const { geninfo } = useGetGeninfosQuery("", {
    selectFromResult: ({ data }) => ({
      geninfo: data?.ids
        .filter(
          (id) => data.entities[id].BioID.toString() === att.bioId.toString()
        )
        .map((id) => data.entities[id])[0],
    }),
  });

  // Casual rate data
  const { data: casualrates } = useGetCasualRatesQuery();

  const [matchingAtt, setMatchingAtt] = useState([]);

  // Printing attendance function
  const handlePrintAtt = async () => {
    const dayCount = getDatesInBetween(
      attModalState.dateFrom,
      attModalState.dateTo
    )?.length;
    /* Check if document requested is appropriate based on employee type and length of dateArr */
    if (geninfo.EmployeeType === "Casual" && dayCount > 7) {
      toast.error(
        `Most # of days required for Casual Time Sheet is 7 days. Requested is ${dayCount} days. Double check your dates!`
      );
      return;
    } else if (dayCount > 15) {
      toast.error(
        `Most # of days required for Regular Time Sheet is 15. Request is ${dayCount}. Double check your dates!`
      );
      return;
    }

    const { ids, entities } = casualrates;
    const currentCasRates = ids.map((id) => entities[id])[0];

    const pdfBytes = await GenerateTimeSheet({
      geninfo,
      filteredAtt,
      dateFrom: attModalState.dateFrom,
      dateTo: attModalState.dateTo,
      casualrates: currentCasRates,
    });

    const modifiedPdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);

    toast.success("Time sheet generated!");
    window.open(modifiedPdfUrl, "_blank");

    attModalDispatch({ type: "close_modal" });
  };

  // For filtering attendance (if date range has been set by user)
  const filteredAtt = attDataFilterer(attModalState, matchingAtt);

  // JSX variable for table body
  const tableContent =
    filteredAtt?.length &&
    filteredAtt
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateB - dateA;
      })
      .slice(tableState.sliceStart, tableState.sliceEnd)
      .map((att, index) => (
        <tr key={index}>
          <td>{att.date}</td>
          <td>{att.checkIn}</td>
          <td>{att.breakOut}</td>
          <td>{att.breakIn}</td>
          <td>{att.checkOut}</td>
        </tr>
      ));

  // Function for showing modal
  const handleShowModal = () => {
    const tempAttData = [];

    // Attendance data processing
    attDataProcessor(attlogData, tempAttData, att);

    setMatchingAtt(tempAttData);
    attModalDispatch({ type: "show_modal" });
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
            attModalState={attModalState}
            attModalDispatch={attModalDispatch}
            tableContent={tableContent}
            handlePrintAtt={handlePrintAtt}
            tableState={tableState}
            tableDispatch={tableDispatch}
            filteredAtt={filteredAtt}
            matchingAtt={matchingAtt}
            att={att}
            geninfo={geninfo}
          />
        </>
      </>
    );
  } else return null;
};

const memoizedAttendance = memo(Attendance);

export default memoizedAttendance;
