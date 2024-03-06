const LeaveCredit = require("../models/LeaveCredit");
const { parse, differenceInYears } = require("date-fns");

// This is the leave credit inclusion and update
const leaveCreditInclUpd = async (geninfos) => {
  const existingLeaveCreditIds = await LeaveCredit.distinct("EmployeeID");

  // Employees w/ 1-4 service years and no LeaveCredit records
  const oneToFourWithoutLeaveCredit = geninfos
    .filter((geninfo) => {
      const parsedDate = parse(
        geninfo?.DateEmployed,
        "MMM dd, yyyy",
        new Date()
      );

      const serviceYears = differenceInYears(new Date(), parsedDate);

      // Check for service years and absence in LeaveCredit
      return (
        serviceYears >= 1 &&
        serviceYears <= 4 &&
        geninfo.EmployeeType === "Regular" &&
        geninfo.EmpStatus === "Y" &&
        !existingLeaveCreditIds.includes(geninfo.EmployeeID)
      );
    })
    .map((geninfo) => geninfo.EmployeeID);

  // Employees w/ 5-7 service years will have updated leave credits
  const fiveToSevenWithLeaveCredit = geninfos
    .filter((geninfo) => {
      const parsedDate = parse(
        geninfo?.DateEmployed,
        "MMM dd, yyyy",
        new Date()
      );

      const serviceYears = differenceInYears(new Date(), parsedDate);

      // Check for service years and absence in LeaveCredit
      return (
        serviceYears >= 5 &&
        serviceYears <= 7 &&
        geninfo.EmployeeType === "Regular" &&
        geninfo.EmpStatus === "Y" &&
        existingLeaveCreditIds.includes(geninfo.EmployeeID)
      );
    })
    .map((geninfo) => geninfo.EmployeeID);

  // Employees w/ 8-10 service years will have updated leave credits
  const eightToTenWithLeaveCredit = geninfos
    .filter((geninfo) => {
      const parsedDate = parse(
        geninfo?.DateEmployed,
        "MMM dd, yyyy",
        new Date()
      );

      const serviceYears = differenceInYears(new Date(), parsedDate);

      // Check for service years and absence in LeaveCredit
      return (
        serviceYears >= 8 &&
        serviceYears <= 10 &&
        geninfo.EmployeeType === "Regular" &&
        geninfo.EmpStatus === "Y" &&
        existingLeaveCreditIds.includes(geninfo.EmployeeID)
      );
    })
    .map((geninfo) => geninfo.EmployeeID);

  // Employees w/ 11-13 service years will have updated leave credits
  const elevenToThirteenWithLeaveCredit = geninfos
    .filter((geninfo) => {
      const parsedDate = parse(
        geninfo?.DateEmployed,
        "MMM dd, yyyy",
        new Date()
      );

      const serviceYears = differenceInYears(new Date(), parsedDate);

      // Check for service years and absence in LeaveCredit
      return (
        serviceYears >= 11 &&
        serviceYears <= 13 &&
        geninfo.EmployeeType === "Regular" &&
        geninfo.EmpStatus === "Y" &&
        existingLeaveCreditIds.includes(geninfo.EmployeeID)
      );
    })
    .map((geninfo) => geninfo.EmployeeID);

  // Employees w/ 14-100 service years will have updated leave credits
  const fourteenToHundredWithLeaveCredit = geninfos
    .filter((geninfo) => {
      const parsedDate = parse(
        geninfo?.DateEmployed,
        "MMM dd, yyyy",
        new Date()
      );

      const serviceYears = differenceInYears(new Date(), parsedDate);

      // Check for service years and absence in LeaveCredit
      return (
        serviceYears >= 14 &&
        serviceYears <= 100 &&
        geninfo.EmployeeType === "Regular" &&
        geninfo.EmpStatus === "Y" &&
        existingLeaveCreditIds.includes(geninfo.EmployeeID)
      );
    })
    .map((geninfo) => geninfo.EmployeeID);

  // Include eligible 0-4 service years employees to leavecredits database
  if (oneToFourWithoutLeaveCredit?.length > 0) {
    oneToFourWithoutLeaveCredit.forEach(async (employeeId) => {
      await LeaveCredit.create({ EmployeeID: employeeId });
    });
  }

  // Re-apply credit budget (necessary for new leavecredit data upload to database)

  /* Leave credits increase and update for employee service greater than 4 years
    (only occurs every 1st of January) */
  const today = new Date();

  if (today.getMonth() === 0 && today.getDate() === 1) {
    if (fiveToSevenWithLeaveCredit?.length > 0) {
      fiveToSevenWithLeaveCredit.forEach(async (employeeId) => {
        const updatedLeaveCredits = await LeaveCredit.findOneAndUpdate(
          { EmployeeID: employeeId },
          { SickLeave: 7, VacationLeave: 7, CreditBudget: 7 },
          { new: true }
        ).exec();

        await updatedLeaveCredits.save();
      });
    }

    if (eightToTenWithLeaveCredit?.length > 0) {
      eightToTenWithLeaveCredit.forEach(async (employeeId) => {
        const updatedLeaveCredits = await LeaveCredit.findOneAndUpdate(
          { EmployeeID: employeeId },
          { SickLeave: 10, VacationLeave: 10, CreditBudget: 10 },
          { new: true }
        ).exec();

        await updatedLeaveCredits.save();
      });
    }

    if (elevenToThirteenWithLeaveCredit?.length > 0) {
      elevenToThirteenWithLeaveCredit.forEach(async (employeeId) => {
        const updatedLeaveCredits = await LeaveCredit.findOneAndUpdate(
          { EmployeeID: employeeId },
          { SickLeave: 12, VacationLeave: 12, CreditBudget: 12 },
          { new: true }
        ).exec();

        await updatedLeaveCredits.save();
      });
    }

    if (fourteenToHundredWithLeaveCredit?.length > 0) {
      fourteenToHundredWithLeaveCredit.forEach(async (employeeId) => {
        const updatedLeaveCredits = await LeaveCredit.findOneAndUpdate(
          { EmployeeID: employeeId },
          { SickLeave: 15, VacationLeave: 15, CreditBudget: 15 },
          { new: true }
        ).exec();

        await updatedLeaveCredits.save();
      });
    }
  }
};

module.exports = { leaveCreditInclUpd };
