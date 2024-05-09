import { PDFDocument, PageSizes } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { FONTS } from "../../config/fontBase64";
import getDatesInBetween from "./getDatesInBetween";
import { format } from "date-fns";

const GenerateTimeSheet = async ({
  geninfo = null,
  filteredAtt = null,
  dateFrom = "",
  dateTo = "",
  casualrates = null,
}) => {
  // Create a document
  const pdfDoc = await PDFDocument.create();

  // Initialize fontkit for custom font usage
  pdfDoc.registerFontkit(fontkit);

  // Gazpacho font
  const gazpachoBlack = await pdfDoc.embedFont(FONTS.GazpachoBlack);
  // const gazpachoRegularItalic = await pdfDoc.embedFont(
  //   FONTS.GazpachoRegularItalic
  // );

  // Work Sans font
  const workSansRegular = await pdfDoc.embedFont(FONTS.WorkSansRegular);
  //const workSansItalic = await pdfDoc.embedFont(FONTS.WorkSansItalic);
  const workSansBold = await pdfDoc.embedFont(FONTS.WorkSansBold);
  const workSansBoldItalic = await pdfDoc.embedFont(FONTS.WorkSansBoldItalic);

  // Function to find fields on the document
  //   const FieldFinder = (fieldName, altFieldName) => {
  //     let row = form.getFieldMaybe(fieldName);
  //     if (!row) {
  //       row = form.getField(altFieldName);
  //     }
  //     let rowName = row.getName();
  //     return form.getTextField(rowName);
  //   };

  // Attendance data
  const dateArr = getDatesInBetween(dateFrom, dateTo);

  // Page setup
  let page = pdfDoc.addPage(PageSizes.Letter);
  let { width, height } = page.getSize();
  const baseFontSize = 14;

  const getCenterX = (text = "", fontSize = 0) => {
    const pageMidpoint = width / 2;
    const textWidth = text.length * (fontSize * 0.25);

    return pageMidpoint - textWidth;
  };

  // Spacing variables
  let space = width * 0.042;
  let colSpace = width * 0.02;
  let rowSpace = height * 0.7;

  // Page parts
  const pageTitle = () => {
    page.drawText("Via Mare Corporation", {
      x: getCenterX("Via Mare Corporation", baseFontSize - 2),
      y: height - 2 * baseFontSize,
      size: baseFontSize - 2,
      font: gazpachoBlack,
    });
    page.drawText("Daily Time Sheet", {
      x: getCenterX("Daily Time Sheet", baseFontSize - 5),
      y: height - 3 * baseFontSize,
      size: baseFontSize - 5,
      font: workSansRegular,
    });
    page.drawText(`(for ${geninfo.EmployeeType} Employees)`, {
      x: getCenterX(
        `(for ${geninfo.EmployeeType} Employees)`,
        baseFontSize - 5
      ),
      y: height - 4 * baseFontSize,
      size: baseFontSize - 5,
      font: workSansRegular,
    });

    // Name section
    page.drawText("NAME:", {
      x: width * 0.05,
      y: height - 7 * baseFontSize,
      size: baseFontSize - 4,
      font: workSansBold,
    });
    page.drawText(
      `${geninfo.LastName ?? ""}, ${geninfo.FirstName ?? ""} ${
        geninfo.MI ?? ""
      }. - (${geninfo.BioID})`,
      {
        x: width * 0.13,
        y: height - 7 * baseFontSize,
        size: baseFontSize - 4,
        font: workSansRegular,
      }
    );
    page.drawLine({
      start: { x: width * 0.13, y: height - 7.2 * baseFontSize },
      end: { x: width * 0.45, y: height - 7.2 * baseFontSize },
    });

    // Dept/Branch section
    page.drawText("DEPT/BRANCH:", {
      x: width * 0.5,
      y: height - 7 * baseFontSize,
      size: baseFontSize - 4,
      font: workSansBold,
    });
    page.drawText(geninfo.AssignedOutlet, {
      x: width * 0.65,
      y: height - 7 * baseFontSize,
      size: baseFontSize - 4,
      font: workSansRegular,
    });
    page.drawLine({
      start: { x: width * 0.65, y: height - 7.2 * baseFontSize },
      end: { x: width * 0.95, y: height - 7.2 * baseFontSize },
    });

    // Official time section
    page.drawText("OFFICIAL TIME:", {
      x: width * 0.05,
      y: height - 8.2 * baseFontSize,
      size: baseFontSize - 4,
      font: workSansBold,
    });
    page.drawText("", {
      x: width * 0.2,
      y: height - 8.2 * baseFontSize,
      size: baseFontSize - 4,
      font: workSansRegular,
    });
    page.drawLine({
      start: { x: width * 0.2, y: height - 8.4 * baseFontSize },
      end: { x: width * 0.3, y: height - 8.4 * baseFontSize },
    });

    // Day-off section
    page.drawText("DAY-OFF:", {
      x: width * 0.32,
      y: height - 8.2 * baseFontSize,
      size: baseFontSize - 4,
      font: workSansBold,
    });
    page.drawText("", {
      x: width * 0.42,
      y: height - 8.2 * baseFontSize,
      size: baseFontSize - 4,
      font: workSansRegular,
    });
    page.drawLine({
      start: { x: width * 0.42, y: height - 8.4 * baseFontSize },
      end: { x: width * 0.52, y: height - 8.4 * baseFontSize },
    });

    // Position section
    page.drawText("POSITION:", {
      x: width * 0.54,
      y: height - 8.2 * baseFontSize,
      size: baseFontSize - 4,
      font: workSansBold,
    });
    page.drawText(geninfo.JobTitle, {
      x: width * 0.65,
      y: height - 8.2 * baseFontSize,
      size: baseFontSize - 4,
      font: workSansRegular,
    });
    page.drawLine({
      start: { x: width * 0.65, y: height - 8.4 * baseFontSize },
      end: { x: width * 0.95, y: height - 8.4 * baseFontSize },
    });

    // Reminders section
    page.drawText(
      "1. If an employee fails to clock in and/or out on a specific date, they will be marked as absent.\n2. Employees are responsible for completing their timesheets, which must then be endorsed by both their Supervisor and Operations Manager.\n3. Any falsification of information on this form constitutes grounds for DISMISSAL (Company Rule 1, Section 1a).\n4. Timesheets must reach the Human Resource Department within two working days after the cut-off date;\nlate submissions will be processed in the subsequent payroll cycle.\n5. Night differentials and overtime payments are calculated strictly on an hourly basis.",
      {
        x: width * 0.05,
        y: height - 10.2 * baseFontSize,
        size: baseFontSize - 6,
        font: workSansRegular,
        lineHeight: 10,
      }
    );
  };
  const pageBody = () => {
    const bodyFontSize = baseFontSize - 6;
    // Table header top border
    page.drawLine({
      start: { x: width * 0.02, y: height * 0.73 },
      end: { x: width * 0.98, y: height * 0.73 },
    });

    // Col names row
    const colNames = [
      "DAYS", // 0
      "TIME-IN", // 1
      "BREAK-OUT", // 2
      "BREAK-IN", // 3
      "TIME-OUT", // 4
      "REG", // 5
      "UT", // 6
      "ROT", // 7
      "ND", // 8
      "SOT", // 9
      "LHOT", // 10
      "SHOT", // 11
      "REMARKS", // 12
    ];

    colNames.forEach((name, index) => {
      if (index === 0) space -= 5;
      if (index === 2) space -= 20;
      if (index === 3) space -= 25;
      if (index === 4) space -= 23;
      if (index === 5) space -= 10;
      if (index === 7) space += 5;
      if (index === 9) space += 5;
      page.drawText(name, {
        font: workSansBold,
        x: space,
        y: height * 0.72,
        size: bodyFontSize,
      });

      if (space < width) space += width * ((name.length * 1.7) / 100);
    });

    // Table header bottom border
    page.drawLine({
      start: { x: width * 0.02, y: height * 0.715 },
      end: { x: width * 0.98, y: height * 0.715 },
    });

    /* Plot attendance data to the table */
    dateArr.forEach((date, index) => {
      const attIndex = filteredAtt.findIndex(
        (att) =>
          new Date(att.date).valueOf() ===
          new Date(format(date, "MM/dd/yyyy")).valueOf()
      );

      // Destructured attendance data
      const {
        date: attDate,
        checkIn,
        checkOut,
        breakIn,
        breakOut,
      } = filteredAtt[attIndex] || {};

      // Day
      page.drawText(
        attIndex !== -1
          ? format(new Date(attDate), "dd-eee")
          : format(new Date(date), "dd-eee"),
        {
          x: width * 0.03,
          y: rowSpace,
          font: workSansBold,
          size: bodyFontSize,
        }
      );

      // Time-in
      page.drawText(
        attIndex !== -1 && checkIn ? format(new Date(checkIn), "p") : "",
        {
          x: width * 0.105,
          y: rowSpace,
          font: workSansBold,
          size: bodyFontSize,
        }
      );

      // Time-out
      /* Also check if time out has the same day to time in. If not, indicate that time out is on different date */
      if (new Date(checkOut).getDate() !== new Date(checkIn).getDate()) {
        page.drawText(
          attIndex !== -1 && checkOut
            ? format(new Date(checkOut), "p (MMM dd)")
            : "",
          {
            x: width * 0.38,
            y: rowSpace,
            font: workSansBold,
            size: bodyFontSize,
          }
        );
      } else {
        page.drawText(
          attIndex !== -1 && checkOut ? format(new Date(checkOut), "p") : "",
          {
            x: width * 0.41,
            y: rowSpace,
            font: workSansBold,
            size: bodyFontSize,
          }
        );
      }

      // Break-out & Break-in
      /* Check if break-out on current row exist */
      if (breakOut) {
        page.drawText(breakOut, {
          font: workSansBold,
          size: bodyFontSize,
          x: width * 0.205,
          y: rowSpace,
        });
        page.drawText(breakIn, {
          font: workSansBold,
          size: bodyFontSize,
          x: width * 0.305,
          y: rowSpace,
        });
      }

      // Table row dividers
      page.drawLine({
        start: { x: width * 0.02, y: rowSpace - 10 },
        end: { x: width * 0.98, y: rowSpace - 10 },
      });

      rowSpace -= 22;
    });

    // Table column dividers
    for (let x = 0; x < 14; x++) {
      if (x === 1) colSpace += 5;
      if (x === 2) colSpace -= 7;
      if (x === 3) colSpace -= 22;
      if (x === 4) colSpace -= 15;
      if (x === 6) colSpace += 10;
      if (x === 7) colSpace += 5;
      if (x === 8) colSpace += 5;
      if (x === 9) colSpace += 5;
      if (x === 10) colSpace += 10;
      if (x === 13) colSpace += 4;

      page.drawLine({
        start: { x: colSpace, y: height * 0.73 },
        end: { x: colSpace, y: rowSpace + 12 },
      });

      colSpace += width * ((colNames?.[x]?.length * 1.5) / 100);
    }
  };
  const pageFooter = () => {
    page.drawText(`"WE CERTIFY THE ACCURACY OF THE ATTENDANCE RECORDS ABOVE"`, {
      font: workSansBoldItalic,
      size: baseFontSize - 4,
      x:
        getCenterX(
          `"WE CERTIFY THE ACCURACY OF THE ATTENDANCE RECORDS ABOVE"`,
          baseFontSize - 4
        ) - 20,
      y: rowSpace - 20,
    });

    // Employee signature
    page.drawLine({
      start: { x: width * 0.05, y: rowSpace - 50 },
      end: { x: width * 0.3, y: rowSpace - 50 },
    });
    page.drawText("Employee", {
      x: width * 0.13,
      y: rowSpace - 60,
      font: workSansBold,
      size: baseFontSize - 4,
    });

    // Supervisor signature
    page.drawLine({
      start: { x: width * 0.35, y: rowSpace - 50 },
      end: { x: width * 0.65, y: rowSpace - 50 },
    });
    page.drawText("Supervisor", {
      x: width * 0.448,
      y: rowSpace - 60,
      font: workSansBold,
      size: baseFontSize - 4,
    });

    // Operations Manager signature
    page.drawLine({
      start: { x: width * 0.7, y: rowSpace - 50 },
      end: { x: width * 0.95, y: rowSpace - 50 },
    });
    page.drawText("Operations Manager", {
      x: width * 0.75,
      y: rowSpace - 60,
      font: workSansBold,
      size: baseFontSize - 4,
    });

    // DIVIDER
    let divLine = "-";
    let divLineX = width * 0.02;

    page.drawText("DO NOT FILL BELOW THIS LINE", {
      font: workSansBoldItalic,
      size: baseFontSize - 4,
      x: width * 0.37,
      y: rowSpace - 80,
      opacity: 0.5,
    });

    do {
      if (divLineX < width * 0.35 || divLineX > width * 0.63)
        page.drawText(divLine, {
          x: divLineX,
          y: rowSpace - 80,
          font: workSansBold,
          size: baseFontSize - 4,
          opacity: 0.5,
        });

      divLineX += 10;
    } while (divLineX < width * 0.98);

    let fillFormSpace = rowSpace - 100;
    // Change fill form based on employee type
    if (geninfo.EmployeeType !== "Casual") {
      const TBFilledArr1 = [
        "No. of Days: __________",
        "Night Diff.: __________",
        "Regular OT: __________",
        "Sunday OT: __________",
      ];
      const TBFilledArr2 = [
        "Absences: __________",
        "Undertime: __________",
        "Legal Hol.: __________",
        "Special Hol.: __________",
      ];

      let arr1Row = width * 0.028;
      TBFilledArr1.forEach((val) => {
        page.drawText(val, {
          x: arr1Row,
          y: fillFormSpace,
          font: workSansBold,
          size: baseFontSize - 4,
        });
        arr1Row += 150;
      });

      fillFormSpace -= 20;

      let arr2Row = width * 0.028;
      TBFilledArr2.forEach((val) => {
        page.drawText(val, {
          x: arr2Row,
          y: fillFormSpace,
          font: workSansBold,
          size: baseFontSize - 4,
        });
        arr2Row += 150;
      });

      fillFormSpace -= 20;
    } else {
      const casualFillFormArr = [
        "No of Days",
        "ND",
        "ROT",
        "SOT",
        "ExSOT",
        "LHOT",
        "ExLHOT",
        "SHOT",
        "ExSHOT",
        "UT",
      ];

      casualFillFormArr.forEach((val) => {
        let rateTxt = "";
        if (val === "No of Days") {
          rateTxt = "x daily rate";
        } else {
          rateTxt = "hrs x hourly rate";
        }

        page.drawText(val + `: __________ ${rateTxt} = ____________________`, {
          size: baseFontSize - 4,
          font: workSansBold,
          x: width * 0.25,
          y: fillFormSpace,
        });

        fillFormSpace -= 20;
      });
    }

    page.drawText("Processed for HRD by: ______________________________", {
      font: workSansBold,
      size: baseFontSize - 4,
      x: width * 0.028,
      y: fillFormSpace - 20,
    });
    page.drawText("Checked by: ______________________________", {
      font: workSansBold,
      size: baseFontSize - 4,
      x: width * 0.6,
      y: fillFormSpace - 20,
    });

    page.drawText(`Print Date/Time: ${format(new Date(), "PPPP pp")}`, {
      font: workSansBold,
      size: baseFontSize - 4,
      x: width * 0.028,
      y: fillFormSpace - 50,
      opacity: 0.5,
    });
    page.drawText(
      `Period Covered: ${format(new Date(dateFrom), "MMM dd")} - ${format(
        new Date(dateTo),
        "PP"
      )}`,
      {
        font: workSansBold,
        size: baseFontSize - 4,
        x: width * 0.6,
        y: fillFormSpace - 50,
        opacity: 0.5,
      }
    );
  };

  // Process page parts
  pageTitle();
  pageBody();
  pageFooter();

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
};

export default GenerateTimeSheet;
