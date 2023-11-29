const GenInfo = require("../models/GenInfo");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllGenInfo = asyncHandler(async (req, res) => {
  const geninfos = await GenInfo.find().lean();
  if (!geninfos?.length) {
    return res.status(400).json({ message: "No general infos found" });
  }
  res.json(geninfos);
});

// @desc Create new user
// @route POST /users
// @access Private
const createGenInfo = asyncHandler(async (req, res) => {
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

  // Create and store new user
  const geninfo = await GenInfo.create({
    EmployeeID,
    BioID,
    Prefix,
    FirstName,
    MiddleName,
    MI: MiddleName[0],
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
});

// @desc Update user
// @route PATCH /users
// @access Private
const updateGenInfo = asyncHandler(async (req, res) => {
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

  // Confirm data
  if (!id || !EmployeeID) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const geninfo = await GenInfo.findById(id).exec();

  if (!geninfo) {
    return res.status(400).json({ message: "General info not found" });
  }

  // Check duplicate
  const duplicate = await GenInfo.findOne({ EmployeeID }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "EmployeeID already taken" });
  }

  geninfo.EmployeeID = EmployeeID;
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

  res.json({ message: `General info of ${updatedGenInfo.EmployeeID} updated` });
});

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  // Check if user exists to delete
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.active) {
    return res.status(400).json({
      message: "User is still active. Deactivate user before deleting.",
    });
  }

  const result = await user.deleteOne();

  const reply = `Username ${user.username} with ID ${user._id} is deleted`;

  res.json(reply);
});

module.exports = { getAllGenInfo, createGenInfo, updateGenInfo };
