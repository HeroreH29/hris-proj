import React from "react";
import { PDFDocument, rgb, StandardFonts, PageSizes } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { FONTS } from "../../config/fontBase64";

const GenerateTimeSheet = async ({ geninfo = null, filteredAtt = null }) => {
  // Create a document
  const pdfDoc = await PDFDocument.create();

  // Initialize fontkit for custom font usage
  pdfDoc.registerFontkit(fontkit);

  // Gazpacho font
  const gazpachoBlack = await pdfDoc.embedFont(FONTS.GazpachoBlack);
  const gazpachoRegularItalic = await pdfDoc.embedFont(
    FONTS.GazpachoRegularItalic
  );

  // Work Sans font
  const workSansRegular = await pdfDoc.embedFont(FONTS.WorkSansRegular);
  const workSansItalic = await pdfDoc.embedFont(FONTS.WorkSansItalic);
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

  // Page setup
  let page = pdfDoc.addPage(PageSizes.Letter);
  let { width, height } = page.getSize();
  const baseFontSize = 14;
  let contentEnd = 0;

  const getCenterX = (text = "", fontSize = 0) => {
    const pageMidpoint = width / 2;
    const textWidth = text.length * (fontSize * 0.25);

    return pageMidpoint - textWidth;
  };

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
    page.drawText("(Regular/Probationary)", {
      x: getCenterX("(Regular/Probationary)", baseFontSize - 5),
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
      `${geninfo.LastName}, ${geninfo.FirstName} ${geninfo.MI}. - (${geninfo.BioID})`,
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
      size: baseFontSize - String(geninfo.JobTitle).length * 0.7,
      font: workSansRegular,
    });
    page.drawLine({
      start: { x: width * 0.65, y: height - 8.4 * baseFontSize },
      end: { x: width * 0.95, y: height - 8.4 * baseFontSize },
    });

    // Reminders section
    page.drawText(
      "1. If an employee fails to clock in and/or out on a specific date, they will be marked as absent.",
      {
        x: width * 0.05,
        y: height - 10.2 * baseFontSize,
        size: baseFontSize - 6,
        font: workSansRegular,
      }
    );
  };
  const pageBody = () => {};

  // Process page parts
  pageTitle();

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;

  //   const blobUrl = URL.createObjectURL(
  //     new Blob([pdfBytes], { type: "application/pdf" })
  //   );

  //   window.open(blobUrl, "_blank");
};

export default GenerateTimeSheet;
