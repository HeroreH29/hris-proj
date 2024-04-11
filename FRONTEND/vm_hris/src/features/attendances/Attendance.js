import React, { memo, useState } from "react";
import { format, parse } from "date-fns";
import { useGetGeninfosQuery } from "../employeerecords/recordsApiSlice";
import { toast } from "react-toastify";
import AttendanceModal from "../../modals/AttendanceModal";
import useAttModalSettings from "../../hooks/useAttModalSettings";
import useTableSettings from "../../hooks/useTableSettings";
import GenerateTimeSheet from "./GenerateTimeSheet";
import getDatesInBetween from "./getDatesInBetween";
import { useGetCasualRatesQuery } from "./attendancesApiSlice";

const Attendance = ({ att, attlogData }) => {
  const { attModalState, attModalDispatch } = useAttModalSettings();
  const { tableState, tableDispatch } = useTableSettings();

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

  // Casual rate data
  const { data: casualrates, error } = useGetCasualRatesQuery();

  const [matchingAtt, setMatchingAtt] = useState([]);

  // Printing attendance function
  const handlePrintAtt = async () => {
    /* Check if document requested is appropriate based on employee type and length of dateArr */
    if (
      geninfo.EmployeeType === "Casual" &&
      getDatesInBetween(attModalState.dateFrom, attModalState.dateTo)?.length >
        7
    ) {
      toast.error(
        `Most # of days required for Casual Time Sheet is 7 days. Requested is ${
          getDatesInBetween(attModalState.dateFrom, attModalState.dateTo)
            ?.length
        } days. Double check your dates!`
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
  const filteredAtt =
    attModalState.dateFrom !== "" && attModalState.dateTo !== ""
      ? matchingAtt.filter((att) => {
          const dateToCompare = new Date(att.date).valueOf();
          const formattedFrom = new Date(
            format(new Date(attModalState.dateFrom), "MM/dd/yyyy")
          ).valueOf();
          const formattedTo = new Date(
            format(new Date(attModalState.dateTo), "MM/dd/yyyy")
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
                breakOut: val2 * 1 === 2 ? formattedTime : "",
                breakIn: val2 * 1 === 3 ? formattedTime : "",
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
