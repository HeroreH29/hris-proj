import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { FONTS } from "../../config/fontBase64";
import { format } from "date-fns";

const PrintLeave = async ({
  leaveToPrint = "",
  leaves = [],
  leaveCredit = {},
  empId = undefined,
}) => {
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

  // Necessary data setup
  const employeeName = leaveCredit.CreditsOf?.FullName;
  const leaveData = leaves
    .filter((leave) => leave.EmployeeID === empId)
    .sort(() => {
      return -1;
    })
    .map((leave) => leave);

  // Page parts
  const pageTitle = () => {
    page.drawText("Via Mare Corporation", {
      x: width / 2.85,
      y: height - 2 * fontSize,
      size: fontSize,
      font: gazpachoBlack,
      color: rgb(0, 124 / 255, 200 / 255),
    });
    page.drawText("Employee's Leave Ledger", {
      x: width / 2.6,
      y: height - 3.25 * fontSize,
      size: fontSize - 5,
      font: workSansBold,
    });
  };

  // Table Header
  page.drawText(`${employeeName} (${empId})`, {
    x: width * 0.06,
    y: height * 0.88,
    size: fontSize - 2,
    font: workSansBoldItalic,
  });
  page.drawText(`* - No Leave Credits`, {
    x: width * 0.77,
    y: height * 0.88,
    size: fontSize - 6,
    font: workSansBoldItalic,
    opacity: 0.5,
  });
  page.drawLine({
    start: { x: width * 0.05, y: height * 0.87 },
    end: { x: width * 0.95, y: height * 0.87 },
    thickness: 3,
    color: rgb(0, 0, 0),
    opacity: 1,
  });

  const detailedPageBody = () => {
    page.drawText("Date Filed", {
      x: width * 0.06,
      y: height * 0.855,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Leave Type", {
      x: width * 0.2,
      y: height * 0.855,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Leave From", {
      x: width * 0.378,
      y: height * 0.855,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Leave Until", {
      x: width * 0.57,
      y: height * 0.855,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Status", {
      x: width * 0.75,
      y: height * 0.855,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Day/s", {
      x: width * 0.89,
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

    // Custom comparison function for grouping leaves by type
    const compareLeavesByType = (leaveA, leaveB) => {
      const leaveTypeOrder = {
        "Sick Leave": 1,
        "Vacation Leave": 2,
        "Birthday Leave:": 3,
        "Matrimonial Leave": 4,
        "Paternity Leave": 5,
        "Maternity Leave": 6,
        "Bereavement Leave": 7,
      };

      const typeA = leaveA.Ltype;
      const typeB = leaveB.Ltype;

      // Get the order index of each leave type
      const orderIndexA = leaveTypeOrder[typeA] || Number.MAX_SAFE_INTEGER;
      const orderIndexB = leaveTypeOrder[typeB] || Number.MAX_SAFE_INTEGER;

      // Compare the order index of leave types
      return orderIndexA - orderIndexB;
    };

    // Table Body
    let dataHeight = 0.82;
    let totalLeaves = 0;
    let currentLeaveType = "";
    leaveData.sort(compareLeavesByType).forEach((leave) => {
      // Checking if current page is full, another page will be created
      if (dataHeight < 0.025) {
        page = pdfDoc.addPage();
        width = page.getSize().width;
        height = page.getSize().height;
        dataHeight = 0.95;
      }

      if (currentLeaveType === "" || currentLeaveType !== leave.Ltype) {
        currentLeaveType = leave.Ltype;
        page.drawText(String(currentLeaveType + "s").toUpperCase(), {
          x: width * 0.045,
          y: height * dataHeight,
          size: fontSize - 2,
          font: workSansBoldItalic,
        });
        dataHeight -= 0.025;
      }

      page.drawText(leave.DateFiled, {
        x: width * 0.06,
        y: height * dataHeight,
        size: fontSize - 6,
        font: workSansRegular,
      });

      let leaveTypeTxt = leave.Ltype;
      if (!leave.Credited && leave.Approve === 1) {
        leaveTypeTxt = `${leave.Ltype} *`;
      }

      page.drawText(leaveTypeTxt, {
        x: width * 0.2,
        y: height * dataHeight,
        size: fontSize - 6,
        font: workSansRegular,
      });
      page.drawText(leave.Lfrom, {
        x: width * 0.375,
        y: height * dataHeight,
        size: fontSize - 6,
        font: workSansRegular,
      });
      page.drawText(leave.Lto, {
        x: width * 0.57,
        y: height * dataHeight,
        size: fontSize - 6,
        font: workSansRegular,
      });
      page.drawText(
        leave.Approve === 1
          ? "Approved"
          : leave.Approve === 2
          ? "Disapproved"
          : leave.Approve === 3
          ? "Cancelled"
          : "Pending",
        {
          x: width * 0.75,
          y: height * dataHeight,
          size: fontSize - 6,
          font: workSansRegular,
        }
      );
      page.drawText(leave.NoOfDays.toString(), {
        x: width * 0.91,
        y: height * dataHeight,
        size: fontSize - 6,
        font: workSansRegular,
      });

      if (leave.Approve === 1) {
        totalLeaves += leave.NoOfDays;
      }
      dataHeight -= 0.025;
    });
    page.drawLine({
      start: { x: width * 0.05, y: height * dataHeight + 0.02 },
      end: { x: width * 0.95, y: height * dataHeight + 0.02 },
      thickness: 1,
      opacity: 1,
    });
    page.drawText("Total # of approved leaves:", {
      x: width * 0.06,
      y: height * dataHeight - 23,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText(totalLeaves.toString(), {
      x: width * 0.91,
      y: height * dataHeight - 23,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawLine({
      start: { x: width * 0.05, y: height * dataHeight - 40 },
      end: { x: width * 0.95, y: height * dataHeight - 40 },
      thickness: 1,
      opacity: 1,
    });

    // Set end of content height for page footer use
    contentEnd = height * dataHeight - 75;
  };
  const summaryPageBody = () => {
    // Used leave values
    const usedSick = leaveCredit.CreditBudget - leaveCredit.SickLeave;
    const usedVacation = leaveCredit.CreditBudget - leaveCredit.VacationLeave;
    const usedMaternity = leaveCredit.MaternityLeave
      ? 105 - leaveCredit.MaternityLeave
      : 0;
    const usedPaternity = leaveCredit.PaternityLeave
      ? 7 - leaveCredit.PaternityLeave
      : 0;
    const usedBirthday = leaveCredit.CreditBudget
      ? 1 - leaveCredit.BirthdayLeave
      : 0;
    const usedMatrim = leaveCredit.MatrimonialLeave
      ? 3 - leaveCredit.MatrimonialLeave
      : 0;
    const usedBereave = 0;
    const totalUsed =
      usedSick +
      usedVacation +
      usedMaternity +
      usedPaternity +
      usedBirthday +
      usedMatrim +
      usedBereave;
    const totalLeaveBalance =
      leaveCredit.SickLeave +
      leaveCredit.VacationLeave +
      leaveCredit.MaternityLeave +
      leaveCredit.PaternityLeave +
      leaveCredit.MatrimonialLeave +
      leaveCredit.BirthdayLeave;

    // Table Body
    page.drawText("Leave Credits", {
      x: width * 0.06,
      y: height * 0.82,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Sick", {
      x: width * 0.24,
      y: height * 0.84,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText(leaveCredit.SickLeave.toString(), {
      x: width * 0.247,
      y: height * 0.82,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Vacation", {
      x: width * 0.317,
      y: height * 0.84,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText(leaveCredit.VacationLeave.toString(), {
      x: width * 0.337,
      y: height * 0.82,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Maternity", {
      x: width * 0.43,
      y: height * 0.84,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText(leaveCredit.MaternityLeave > 0 ? "105" : "0", {
      x: width * 0.46,
      y: height * 0.82,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Paternity", {
      x: width * 0.55,
      y: height * 0.84,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText(leaveCredit.PaternityLeave > 0 ? "7" : "0", {
      x: width * 0.58,
      y: height * 0.82,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Birthday", {
      x: width * 0.66,
      y: height * 0.84,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText(leaveCredit.BirthdayLeave.toString(), {
      x: width * 0.685,
      y: height * 0.82,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("Matrim.", {
      x: width * 0.766,
      y: height * 0.84,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText(leaveCredit.MatrimonialLeave > 0 ? "3" : "0", {
      x: width * 0.79,
      y: height * 0.82,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText("TOTAL", {
      x: width * 0.87,
      y: height * 0.84,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText(String(totalLeaveBalance), {
      x: width * 0.89,
      y: height * 0.82,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawLine({
      start: { x: width * 0.05, y: height * 0.835 },
      end: { x: width * 0.95, y: height * 0.835 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
    page.drawLine({
      start: { x: width * 0.05, y: height * 0.815 },
      end: { x: width * 0.95, y: height * 0.815 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
    page.drawText("Used Credits", {
      x: width * 0.06,
      y: height * 0.8,
      size: fontSize - 6,
      font: workSansRegular,
    });
    page.drawText(String(usedSick), {
      x: width * 0.247,
      y: height * 0.8,
      size: fontSize - 6,
      font: workSansRegular,
    });
    page.drawText(String(usedVacation), {
      x: width * 0.337,
      y: height * 0.8,
      size: fontSize - 6,
      font: workSansRegular,
    });
    page.drawText(String(usedMaternity), {
      x: width * 0.46,
      y: height * 0.8,
      size: fontSize - 6,
      font: workSansRegular,
    });
    page.drawText(String(usedPaternity), {
      x: width * 0.58,
      y: height * 0.8,
      size: fontSize - 6,
      font: workSansRegular,
    });
    page.drawText(String(usedBirthday), {
      x: width * 0.685,
      y: height * 0.8,
      size: fontSize - 6,
      font: workSansRegular,
    });
    page.drawText(String(usedMatrim), {
      x: width * 0.79,
      y: height * 0.8,
      size: fontSize - 6,
      font: workSansRegular,
    });
    page.drawText(String(totalUsed), {
      x: width * 0.89,
      y: height * 0.8,
      size: fontSize - 6,
      font: workSansRegular,
    });
    page.drawLine({
      start: { x: width * 0.05, y: height * 0.795 },
      end: { x: width * 0.95, y: height * 0.795 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
    page.drawText("Total # of Used Credits:", {
      x: width * 0.06,
      y: height * 0.77,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawText(String(totalUsed), {
      x: width * 0.89,
      y: height * 0.77,
      size: fontSize - 6,
      font: workSansBold,
    });
    page.drawLine({
      start: { x: width * 0.05, y: height * 0.835 },
      end: { x: width * 0.05, y: height * 0.795 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
    page.drawLine({
      start: { x: width * 0.22, y: height * 0.835 },
      end: { x: width * 0.22, y: height * 0.795 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
    page.drawLine({
      start: { x: width * 0.3, y: height * 0.835 },
      end: { x: width * 0.3, y: height * 0.795 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
    page.drawLine({
      start: { x: width * 0.405, y: height * 0.835 },
      end: { x: width * 0.405, y: height * 0.795 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
    page.drawLine({
      start: { x: width * 0.525, y: height * 0.835 },
      end: { x: width * 0.525, y: height * 0.795 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
    page.drawLine({
      start: { x: width * 0.642, y: height * 0.835 },
      end: { x: width * 0.642, y: height * 0.795 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
    page.drawLine({
      start: { x: width * 0.745, y: height * 0.835 },
      end: { x: width * 0.745, y: height * 0.795 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
    page.drawLine({
      start: { x: width * 0.843, y: height * 0.835 },
      end: { x: width * 0.843, y: height * 0.795 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
    page.drawLine({
      start: { x: width * 0.95, y: height * 0.835 },
      end: { x: width * 0.95, y: height * 0.795 },
      thickness: 1,
      color: rgb(0, 0, 0),
      opacity: 1,
    });

    // Set end of content height for page footer use
    contentEnd = height * 0.65;
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
  leaveToPrint === "Detailed" ? detailedPageBody() : summaryPageBody();

  // Footer
  pageFooter();

  const pdfBytes = await pdfDoc.save();

  const blobUrl = URL.createObjectURL(
    new Blob([pdfBytes], { type: "application/pdf" })
  );

  window.open(blobUrl, "_blank");
};

export default PrintLeave;
