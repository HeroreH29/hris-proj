import { format, parse } from "date-fns";
import GenerateTimeSheet from "./GenerateTimeSheet";

const AttLogProcessor = () => {
  const attListProcessor = (
    ids = [],
    entities = [],
    fileContents = "",
    setAttlogData
  ) => {
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
            tempAttList.push({
              bioId: bioId,
              name: matchedRecord?.FullName,
              outlet: matchedRecord?.AssignedOutlet,
              empType: matchedRecord?.EmployeeType,
            });
          }
        }
      });
    } catch (error) {
      console.error(`ProcessAttlog() Error: ${error}`);
    }

    // Clean array of objects with undefined field values
    return tempAttList;
  };

  const pdfListProcessor = async (
    att,
    attlogData,
    geninfos,
    attModalState,
    casualrates
  ) => {
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
      console.error(`GenerateAttDataPdf Error: ${error}`);
    }

    const filteredAtt =
      attModalState.dateFrom !== "" && attModalState.dateTo !== ""
        ? tempAttData.filter((att) => {
            const dateToCompare = new Date(att.date).valueOf();
            const formattedFrom = new Date(
              format(new Date(attModalState.dateFrom), "MM/dd/yyyy")
            ).valueOf();
            const formattedTo = new Date(
              format(new Date(attModalState.dateTo), "MM/dd/yyyy")
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

    const generatedPdf = await GenerateTimeSheet({
      geninfo,
      filteredAtt,
      dateFrom: attModalState.dateFrom,
      dateTo: attModalState.dateTo,
      casualrates,
    });

    return generatedPdf;
  };

  return {
    attListProcessor,
    pdfListProcessor,
  };
};

export default AttLogProcessor;
