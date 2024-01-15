const GenInfo = require("../models/GenInfo");
const PersonalInfo = require("../models/PersonalInfo");
const Dependent = require("../models/Dependent");
const EducInfo = require("../models/EducInfo");
const WorkInfo = require("../models/WorkInfo");
const Leave = require("../models/Leave");
const LeaveCredit = require("../models/LeaveCredit");
const { differenceInYears } = require("date-fns");

// @desc Get all geninfos
// @route GET /geninfos
// @access Private
const getAllGenInfo = async (req, res) => {
  const geninfos = await GenInfo.find().lean();

  if (!geninfos?.length) {
    return res.status(400).json({ message: "No general infos found" });
  }

  // Employees w/ 0-4 service years
  const zeroToFour = geninfos
    .filter(
      (geninfo) =>
        differenceInYears(new Date(geninfo.DateEmployed), new Date()) <= 4 &&
        geninfo.EmpStatus === "Y" &&
        geninfo.EmployeeType === "Regular"
    )
    .map((geninfo) => geninfo.EmployeeID);

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
    updatedLeaveRecord
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
