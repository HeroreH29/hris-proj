const GenInfo = require("../models/GenInfo");
const PersonalInfo = require("../models/PersonalInfo");
const Dependent = require("../models/Dependent");
const EducInfo = require("../models/EducInfo");
const WorkInfo = require("../models/WorkInfo");
const Leave = require("../models/Leave");
const LeaveCredit = require("../models/LeaveCredit");
const {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  parse,
  format,
  addMonths,
} = require("date-fns");

// This is the leave credit inclusion and update
const leaveCreditInclUpd = async (geninfos) => {
  const existingLeaveCreditIds = await LeaveCredit.distinct("EmployeeID");

  // Employees w/ 0-4 service years and no LeaveCredit records
  const zeroToFourWithoutLeaveCredit = geninfos
    .filter((geninfo) => {
      const parsedDate = parse(
        geninfo?.DateEmployed,
        "MMM dd, yyyy",
        new Date()
      );

      const serviceYears = differenceInYears(new Date(), parsedDate);

      // Check for service years and absence in LeaveCredit
      return (
        serviceYears >= 0 &&
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
  if (zeroToFourWithoutLeaveCredit?.length > 0) {
    zeroToFourWithoutLeaveCredit.forEach(async (employeeId) => {
      await LeaveCredit.create({ EmployeeID: employeeId });
    });
  }

  /* Leave credits increase and update for employee service greater than 4 years
  (only occurs every 1st of January) */
  const today = new Date();

  if (
    fiveToSevenWithLeaveCredit?.length > 0 &&
    today.getMonth() === 0 &&
    today.getDate() === 1
  ) {
    fiveToSevenWithLeaveCredit.forEach(async (employeeId) => {
      const updatedLeaveCredits = await LeaveCredit.findOneAndUpdate(
        { EmployeeID: employeeId },
        { SickLeave: 7, VacationLeave: 7 },
        { new: true }
      ).exec();

      await updatedLeaveCredits.save();
    });
  }

  if (
    eightToTenWithLeaveCredit?.length > 0 &&
    today.getMonth() === 0 &&
    today.getDate() === 1
  ) {
    eightToTenWithLeaveCredit.forEach(async (employeeId) => {
      const updatedLeaveCredits = await LeaveCredit.findOneAndUpdate(
        { EmployeeID: employeeId },
        { SickLeave: 10, VacationLeave: 10 },
        { new: true }
      ).exec();

      await updatedLeaveCredits.save();
    });
  }

  if (
    elevenToThirteenWithLeaveCredit?.length > 0 &&
    today.getMonth() === 0 &&
    today.getDate() === 1
  ) {
    elevenToThirteenWithLeaveCredit.forEach(async (employeeId) => {
      const updatedLeaveCredits = await LeaveCredit.findOneAndUpdate(
        { EmployeeID: employeeId },
        { SickLeave: 12, VacationLeave: 12 },
        { new: true }
      ).exec();

      await updatedLeaveCredits.save();
    });
  }

  if (
    fourteenToHundredWithLeaveCredit?.length > 0 &&
    today.getMonth() === 0 &&
    today.getDate() === 1
  ) {
    fourteenToHundredWithLeaveCredit.forEach(async (employeeId) => {
      const updatedLeaveCredits = await LeaveCredit.findOneAndUpdate(
        { EmployeeID: employeeId },
        { SickLeave: 15, VacationLeave: 15 },
        { new: true }
      ).exec();

      await updatedLeaveCredits.save();
    });
  }
};

// This is the automated employee regularization
const autoEmployeeRegularization = async (geninfos) => {
  const toRegular = geninfos
    .filter(
      (geninfo) =>
        geninfo?.EmployeeType === "Probationary" && geninfo.EmpStatus === "Y"
    )
    .map((geninfo) => geninfo);

  if (toRegular?.length > 0) {
    toRegular.forEach(async (geninfo) => {
      let parsedDate;
      const dateToday = new Date();

      // Regularization Date exist
      if (geninfo?.RegDate) {
        parsedDate = parse(geninfo?.RegDate, "MMMM dd, yyyy", new Date());
        if (differenceInDays(dateToday, parsedDate) >= 1) {
          const updateGeninfo = await GenInfo.findOneAndUpdate(
            { EmployeeID: geninfo?.EmployeeID },
            { EmployeeType: "Regular" },
            { new: true }
          ).exec();

          await updateGeninfo.save();
        }
      }
      // Probationary Date exist
      else if (geninfo?.DateProbationary) {
        parsedDate = parse(
          geninfo?.DateProbationary,
          "MMM dd, yyyy",
          new Date()
        );
        if (differenceInMonths(dateToday, parsedDate) >= 6) {
          const updateGeninfo = await GenInfo.findOneAndUpdate(
            { EmployeeID: geninfo?.EmployeeID },
            {
              EmployeeType: "Regular",
              RegDate: format(addMonths(parsedDate, 6), "MMMM dd, yyyy"),
            },
            { new: true }
          ).exec();

          await updateGeninfo.save();
        }
      }
      // Date Employed exist
      else if (geninfo?.DateEmployed) {
        parsedDate = parse(geninfo?.DateEmployed, "MMM dd, yyyy", new Date());
        if (differenceInMonths(dateToday, parsedDate) >= 6) {
          const updateGeninfo = await GenInfo.findOneAndUpdate(
            { EmployeeID: geninfo?.EmployeeID },
            {
              EmployeeType: "Regular",
              RegDate: format(addMonths(parsedDate, 6), "MMMM dd, yyyy"),
              DateProbationary: format(parsedDate, "MMM dd, yyyy"),
            },
            { new: true }
          ).exec();

          await updateGeninfo.save();
        }
      }
    });
  }
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

  autoEmployeeRegularization(geninfos);
  leaveCreditInclUpd(geninfos);

  res.json(geninfos);
};

// @desc Create new geninfo
// @route POST /geninfos
// @access Private
const createGenInfo = async (req, res) => {
  const {
    EmployeeID,
    BioID,
    Prefix,
    FirstName,
    MiddleName,
    LastName,
    EmployeeType,
    AssignedOutlet,
    Department,
    JobTitle,
    DateEmployed,
    DateLeaved,
    DateProbationary,
    RegDate,
    EmpStatus,
    Notes,
    TINnumber,
    SSSnumber,
    PInumber,
    PHnumber,
    ATMnumber,
  } = req.body;

  // Confirm data
  if (
    !EmployeeID ||
    !BioID ||
    !FirstName ||
    !LastName ||
    !EmployeeType ||
    !AssignedOutlet ||
    !Department ||
    !JobTitle ||
    !DateEmployed ||
    !DateProbationary ||
    !EmpStatus ||
    !TINnumber ||
    !SSSnumber ||
    !PInumber ||
    !PHnumber
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check duplicates
  const duplicate = await GenInfo.findOne({ EmployeeID }).lean().exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: `EmployeeID ${EmployeeID} already exists` });
  }

  // Create and store new geninfo
  const geninfo = await GenInfo.create({
    EmployeeID,
    BioID,
    Prefix,
    FirstName,
    MiddleName,
    MI: MiddleName ?? "",
    LastName,
    EmployeeType,
    AssignedOutlet,
    Department,
    JobTitle,
    DateEmployed,
    DateLeaved,
    DateProbationary,
    RegDate,
    EmpStatus,
    Notes,
    TINnumber,
    SSSnumber,
    PInumber,
    PHnumber,
    ATMnumber,
  });

  if (geninfo) {
    res
      .status(201)
      .json({ message: `New general info with ${EmployeeID} created` });
  } else {
    res.status(500).json({ message: "Invalid general info data received" });
  }
};

// @desc Update user
// @route PATCH /users
// @access Private
const updateGenInfo = async (req, res) => {
  const {
    id,
    EmployeeID,
    BioID,
    Prefix,
    FirstName,
    MiddleName,
    LastName,
    EmployeeType,
    AssignedOutlet,
    Department,
    JobTitle,
    DateEmployed,
    DateLeaved,
    DateProbationary,
    RegDate,
    EmpStatus,
    Notes,
    TINnumber,
    SSSnumber,
    PInumber,
    PHnumber,
    ATMnumber,
  } = req.body;

  const newEmployeeID = EmployeeID;

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

  /* It is also required to update the EmployeeID (changed or not) 
  of other information of the specific employee */

  const personalinfo = await PersonalInfo.findOne({
    EmployeeID: geninfo.EmployeeID,
  }).exec();
  const dependent = await Dependent.find({
    EmployeeID: geninfo.EmployeeID,
  }).exec();
  const educinfo = await EducInfo.find({
    EmployeeID: geninfo.EmployeeID,
  }).exec();
  const workinfo = await WorkInfo.find({
    EmployeeID: geninfo.EmployeeID,
  }).exec();
  const leaveRecord = await Leave.find({
    EmployeeID: geninfo.EmployeeID,
  }).exec();
  const leaveCreditRecord = await LeaveCredit.find({
    EmployeeID: geninfo.EmployeeID,
  }).exec();

  // Apply changes to other informations
  let updatedPersonalInfo;
  if (personalinfo) {
    personalinfo.EmployeeID = newEmployeeID;
    updatedPersonalInfo = await personalinfo.save();
  }

  let updatedDependent;
  if (dependent?.length > 0) {
    dependent.forEach((dep) => {
      dep.EmployeeID = newEmployeeID;
    });
    updatedDependent = await dependent.save();
  }

  let updatedEducInfo;
  if (educinfo?.length > 0) {
    educinfo.forEach((educ) => {
      educ.EmployeeID = newEmployeeID;
    });
    updatedEducInfo = await educinfo.save();
  }

  let updatedWorkInfo;
  if (workinfo?.length > 0) {
    workinfo.forEach((work) => {
      work.EmployeeID = newEmployeeID;
    });
    updatedWorkInfo = await workinfo.save();
  }

  let updatedLeaveRecord;
  if (leaveRecord?.length > 0) {
    leaveRecord.forEach((leave) => {
      leave.EmployeeID = newEmployeeID;
    });
    updatedLeaveRecord = await leaveRecord.save();
  }

  let updatedLeaveCredit;
  if (leaveCreditRecord) {
    leaveCreditRecord.EmployeeID = newEmployeeID;
    updatedLeaveCredit = await leaveCreditRecord.save();
  }

  geninfo.EmployeeID = newEmployeeID;
  geninfo.BioID = BioID;
  geninfo.Prefix = Prefix;
  geninfo.FirstName = FirstName;
  geninfo.MiddleName = MiddleName;
  geninfo.LastName = LastName;
  geninfo.EmployeeType = EmployeeType;
  geninfo.AssignedOutlet = AssignedOutlet;
  geninfo.Department = Department;
  geninfo.JobTitle = JobTitle;
  geninfo.DateEmployed = DateEmployed;
  geninfo.DateLeaved = DateLeaved;
  geninfo.DateProbationary = DateProbationary;
  geninfo.RegDate = RegDate;
  geninfo.EmpStatus = EmpStatus;
  geninfo.Notes = Notes;
  geninfo.TINnumber = TINnumber;
  geninfo.SSSnumber = SSSnumber;
  geninfo.PInumber = PInumber;
  geninfo.PHnumber = PHnumber;
  geninfo.ATMnumber = ATMnumber;

  const updatedGenInfo = await geninfo.save();

  // Check if EmployeeID across other informations are updated
  if (
    updatedGenInfo &&
    updatedPersonalInfo &&
    updatedDependent &&
    updatedEducInfo &&
    updatedWorkInfo &&
    updatedLeaveRecord &&
    updatedLeaveCredit
  ) {
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
