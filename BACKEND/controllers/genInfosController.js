const GenInfo = require("../models/GenInfo");
const PersonalInfo = require("../models/PersonalInfo");
const Dependent = require("../models/Dependent");
const EducInfo = require("../models/EducInfo");
const WorkInfo = require("../models/WorkInfo");
const Leave = require("../models/Leave");
const LeaveCredit = require("../models/LeaveCredit");
const InactiveEmp = require("../models/InactiveEmp");
const {
  differenceInYears,
  differenceInDays,
  differenceInMonths,
  parse,
} = require("date-fns");

// Extra checking if EmployeeID are all numbers or not
const isStringAllNumber = (EmployeeID) => {
  // EmployeeID are all numbers
  const isANumber = !isNaN(Number(EmployeeID));
  if (isANumber) {
    return EmployeeID * 1;
  }

  // Return unchanged if not
  return EmployeeID;
};

// EmployeeID updater for other informations
const UpdateEmployeeID = async (origEmployeeID, newEmployeeID) => {
  // Fetch documents from other informations using EmployeeID
  const personalinfo = await PersonalInfo.findOne({
    EmployeeID: origEmployeeID,
  }).exec();

  const dependent = await Dependent.find({
    EmployeeID: origEmployeeID,
  }).exec();

  const educinfo = await EducInfo.find({
    EmployeeID: origEmployeeID,
  }).exec();

  const workinfo = await WorkInfo.find({
    EmployeeID: origEmployeeID,
  }).exec();

  const leaveRecord = await Leave.find({
    EmployeeID: origEmployeeID,
  }).exec();

  const leaveCreditRecord = await LeaveCredit.findOne({
    EmployeeID: origEmployeeID,
  }).exec();

  const inactiveEmpRecord = await InactiveEmp.findOne({
    EmployeeID: origEmployeeID,
  }).exec();

  // Apply changes to other informations
  if (personalinfo) {
    personalinfo.EmployeeID = newEmployeeID;
    await personalinfo.save();
  }

  if (dependent?.length) {
    dependent.forEach(async (dep) => {
      dep.EmployeeID = newEmployeeID;
      await dep.save();
    });
  }

  if (educinfo?.length) {
    educinfo.forEach(async (educ) => {
      educ.EmployeeID = newEmployeeID;
      await educ.save();
    });
  }

  if (workinfo?.length) {
    workinfo.forEach(async (work) => {
      work.EmployeeID = newEmployeeID;
      await work.save();
    });
  }

  if (leaveRecord?.length) {
    leaveRecord.forEach(async (leave) => {
      leave.EmployeeID = newEmployeeID;
      await leave.save();
    });
  }

  if (leaveCreditRecord) {
    leaveCreditRecord.EmployeeID = newEmployeeID;
    await leaveCreditRecord.save();
  }

  if (inactiveEmpRecord) {
    inactiveEmpRecord.EmployeeID = newEmployeeID;
    await inactiveEmpRecord.save();
  }
};

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

// Function to update records that are inactive or contract has ended
const UpdateInactiveEmployees = async (geninfos) => {
  geninfos
    .filter((g) => {
      const contractDateEnd = parse(
        g?.ContractDateEnd,
        "MMMM dd, yyyy",
        new Date()
      );
      const dateToday = new Date();
      const daysLeft = differenceInDays(dateToday, contractDateEnd);
      return g.EmpStatus === "N" || daysLeft < 1;
    })
    .forEach(async (g) => {
      await GenInfo.findOneAndUpdate(
        { EmployeeID: g.EmployeeID },
        {
          DateEmployed: "",
          DateProbationary: "",
          RegDate: "",
          EmpStatus: "N",
          ContractDateEnd: "",
        }
      ).exec();
    });
};

// @desc Get all geninfos
// @route GET /geninfos
// @access Private
// Includes leave credit inclusion and update, and automated employee regularization
const getAllGenInfo = async (req, res) => {
  const geninfos = await GenInfo.find().lean();

  if (!geninfos?.length) {
    return res.status(400).json({ message: "No general infos found" });
  }

  leaveCreditInclUpd(geninfos);
  UpdateInactiveEmployees(geninfos);

  res.json(geninfos);
};

// @desc Create new geninfo
// @route POST /geninfos
// @access Private
const createGenInfo = async (req, res) => {
  const {
    Prefix,
    MiddleName,
    DateLeaved,
    RegDate,
    DateProbationary,
    Notes,
    ATMnumber,
    ContractDateEnd,
    ...others
  } = req.body;

  // Check if other properties of the request body has values
  const othersHasValues = Object.values(others).every(
    (value) => value !== "" && value !== null
  );

  // Confirm data
  if (!othersHasValues) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check duplicates
  const duplicate = await GenInfo.findOne({ EmployeeID: others?.EmployeeID })
    .lean()
    .exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: `EmployeeID ${others?.EmployeeID} already exists` });
  }

  const newEmployeeID = isStringAllNumber(others?.EmployeeID);

  // Create and store new geninfo
  const newGenInfo = { ...req.body, MI: MiddleName ?? "" };
  const geninfo = await GenInfo.create(newGenInfo);

  if (geninfo) {
    res
      .status(201)
      .json({ message: `New general info with ${newEmployeeID} created` });
  } else {
    res.status(500).json({ message: "Invalid general info data received" });
  }
};

// @desc Update user
// @route PATCH /users
// @access Private
const updateGenInfo = async (req, res) => {
  const { id, EmployeeID, BioID, ...others } = req.body;

  const newEmployeeID = isStringAllNumber(EmployeeID);

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Information 'id' is required" });
  }

  const geninfo = await GenInfo.findById(id).exec();

  if (!geninfo) {
    return res.status(400).json({ message: "Information not found" });
  }

  // Check duplicate
  const duplicate = await GenInfo.exists({ EmployeeID: geninfo.EmployeeID });

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "EmployeeID already taken" });
  }

  const newGenInfo = await GenInfo.findByIdAndUpdate(id, others, {
    new: true,
  }).exec();

  if (geninfo?.EmployeeID !== newEmployeeID) {
    newGenInfo.EmployeeID = newEmployeeID;

    /* It is also required to update the EmployeeID
    of other information of the employee if EmployeeID is changed/modified */
    UpdateEmployeeID(geninfo?.EmployeeID, newEmployeeID);
  }

  const updatedGenInfo = await newGenInfo.save();

  if (updatedGenInfo) {
    res.json({
      message: `Information of ${updatedGenInfo.EmployeeID} updated`,
    });
  } else {
    res.json({ message: "Something went wrong" });
  }
};

// @desc Delete user
// @route DELETE /users
// @access Private
// const deleteUser = async (req, res) => {
//   const { id } = req.body;

//   if (!id) {
//     return res.status(400).json({ message: "User ID required" });
//   }

//   // Check if user exists to delete
//   const user = await User.findById(id).exec();

//   if (!user) {
//     return res.status(400).json({ message: "User not found" });
//   }

//   if (user.active) {
//     return res.status(400).json({
//       message: "User is still active. Deactivate user before deleting.",
//     });
//   }

//   const result = await user.deleteOne();

//   const reply = `Username ${user.username} with ID ${user._id} is deleted`;

//   res.json(reply);
// };

module.exports = { getAllGenInfo, createGenInfo, updateGenInfo };
