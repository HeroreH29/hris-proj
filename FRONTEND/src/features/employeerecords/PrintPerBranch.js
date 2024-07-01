import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { FONTS } from "../../config/fontBase64";
import { format } from "date-fns";

const PrintPerBranch = async ({ branch = "", employees = [] }) => {
  // Page attributes setup
  const pdfDoc = await PDFDocument.create();

  // Register fontkit from pdf-lib to use a custom font
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

  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();
  const fontSize = 16;
  let contentEnd = 0;

  // Page parts
  const pageTitle = () => {
    page.drawText("Via Mare Corporation", {
      x: width / 2.85,
      y: height - 2 * fontSize,
      size: fontSize,
      font: gazpachoBlack,
      color: rgb(0, 124 / 255, 200 / 255),
    });
    page.drawText("List of Employees", {
      x: width / 2.4,
      y: height - 3.25 * fontSize,
      size: fontSize - 5,
      font: workSansBold,
    });
  };

  // Table Header
  page.drawText(`${branch.toUpperCase()} EMPLOYEES`, {
    x: width * 0.06,
    y: height * 0.88,
    size: fontSize,
    font: workSansBoldItalic,
  });
  page.drawLine({
    start: { x: width * 0.05, y: height * 0.87 },
    end: { x: width * 0.95, y: height * 0.87 },
    thickness: 3,
    color: rgb(0, 0, 0),
    opacity: 1,
  });

  const pageBody = () => {
    page.drawText("Employee ID", {
      x: width * 0.06,
      y: height * 0.855,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Name", {
      x: width * 0.2,
      y: height * 0.855,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Job Title", {
      x: width * 0.5,
      y: height * 0.855,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Status", {
      x: width * 0.83,
      y: height * 0.855,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawLine({
      start: { x: width * 0.05, y: height * 0.85 },
      end: { x: width * 0.95, y: height * 0.85 },
      thickness: 1,
      opacity: 1,
    });

    // Table Body/Content
    let dataHeight = 0.83;
    employees.forEach((employee) => {
      // Checking if current page is full, another page will be created
      if (dataHeight < 0.025) {
        page = pdfDoc.addPage();
        width = page.getSize().width;
        height = page.getSize().height;
        dataHeight = 0.95;
      }

      // Employee ID
      page.drawText(String(employee.EmployeeID), {
        x: width * 0.06,
        y: height * dataHeight,
        size: fontSize - 6,
        font: workSansBold,
      });

      // Name
      page.drawText(
        employee.FullName.length > 24
          ? employee.FullName.substring(0, 24) + "..."
          : employee.FullName,
        {
          x: width * 0.2,
          y: height * dataHeight,
          size: fontSize - 6,
          font: workSansRegular,
        }
      );

      // Job Title
      page.drawText(
        employee.JobTitle.length > 24
          ? employee.JobTitle.substring(0, 24) + "..."
          : employee.JobTitle,
        {
          x: width * 0.5,
          y: height * dataHeight,
          size: fontSize - 6,
          font: workSansRegular,
        }
      );

      // Status
      page.drawText(employee.EmpStatus === "Y" ? "Active" : "Inactive", {
        x: width * 0.83,
        y: height * dataHeight,
        size: fontSize - 6,
        font: workSansBold,
        color: employee.EmpStatus === "Y" ? rgb(0, 0.5, 0) : rgb(1, 0, 0),
      });

      dataHeight -= 0.025;
    });

    // Set end of content height for page footer use
    contentEnd = height * dataHeight - 50;
  };

  const pageFooter = async () => {
    page.drawText("Date Generated:", {
      x: width * 0.06,
      y: contentEnd,
      size: fontSize - 6,
      font: workSansBoldItalic,
      opacity: 0.5,
    });
    page.drawText(
      `${format(new Date(), "PPPP")} @ ${format(new Date(), "pp")}`,
      {
        x: width * 0.225,
        y: contentEnd,
        size: fontSize - 6,
        font: workSansItalic,
        opacity: 0.5,
      }
    );

    const text = `"The information contained in this document is confidential and intended solely for the recipient. Unauthorized disclosure, copying, or distribution of this content is strictly prohibited. Any breach of confidentiality will be subject to legal action. This document also includes confidential information related to Via Mare Corporation and may only be requested within the organization."\n- Via Mare Corp. (${new Date()
      .getFullYear()
      .toString()})`;
    page.drawText(text, {
      x: width * 0.04,
      y: contentEnd - 25,
      size: fontSize - 9,
      opacity: 0.5,
      font: gazpachoRegularItalic,
      lineHeight: fontSize - 4,
      maxWidth: 550,
      wordBreaks: [" "],
    });
  };

  // Title
  pageTitle();

  // Body
  pageBody();
  //leaveToPrint === "Detailed" ? detailedPageBody() : summaryPageBody();

  // Footer
  pageFooter();

  const pdfBytes = await pdfDoc.save();

  const blobUrl = URL.createObjectURL(
    new Blob([pdfBytes], { type: "application/pdf" })
  );

  window.open(blobUrl, "_blank");
};

export default PrintPerBranch;
