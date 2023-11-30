const PersonalInfo = require("../models/PersonalInfo");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllPersonalInfo = asyncHandler(async (req, res) => {
  const personalInfos = await PersonalInfo.find().lean();
  if (!personalInfos?.length) {
    return res.status(400).json({ message: "No personal infos found" });
  }
  res.json(personalInfos);
});

// @desc Create new user
// @route POST /users
// @access Private
const createPersonalInfo = asyncHandler(async (req, res) => {
  const {
    EmployeeID,
    Birthday,
    Address,
    ZipCode,
    Email,
    Gender,
    CivilStatus,
    Height,
    Weight,
    Phone,
    Mobile,
    Spouse,
    FatherName,
    Foccupation,
    MotherName,
    Moccupation,
  } = req.body;

  // Confirm data
  if (
    !EmployeeID ||
    !Birthday ||
    !Address ||
    !ZipCode ||
    !Gender ||
    !CivilStatus ||
    !Height ||
    !Weight
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check duplicates
  const duplicate = await PersonalInfo.findOne({ EmployeeID }).lean().exec();
  if (duplicate) {
    return res
      .status(409)
      .json({ message: `EmployeeID ${EmployeeID} already exists` });
  }

  // Create and store new user
  const personalinfo = await PersonalInfo.create({
    EmployeeID,
    Birthday,
    Address,
    ZipCode,
    Email,
    Gender,
    CivilStatus,
    Height,
    Weight,
    Phone,
    Mobile,
    Spouse,
    FatherName,
    Foccupation,
    MotherName,
    Moccupation,
  });

  if (personalinfo) {
    res
      .status(201)
      .json({ message: `New personal info with ${EmployeeID} created` });
  } else {
    res.status(500).json({ message: "Invalid personal info data received" });
  }
});

// @desc Update user
// @route PATCH /users
// @access Private
const updatePersonalInfo = asyncHandler(async (req, res) => {
  const {
    id,
    EmployeeID,
    Birthday,
    Address,
    ZipCode,
    Email,
    Gender,
    CivilStatus,
    Height,
    Weight,
    Phone,
    Mobile,
    Spouse,
    FatherName,
    Foccupation,
    MotherName,
    Moccupation,
  } = req.body;

  // Confirm data
  if (!id || !EmployeeID) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const personalinfo = await PersonalInfo.findById(id).exec();

  if (!personalinfo) {
    return res.status(400).json({ message: "Personal info not found" });
  }

  // Check duplicate
  const duplicate = await PersonalInfo.findOne({ EmployeeID }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "EmployeeID already taken" });
  }

  personalinfo.EmployeeID = EmployeeID;
  personalinfo.Birthday = Birthday;
  personalinfo.Address = Address;
  personalinfo.ZipCode = ZipCode;
  personalinfo.Email = Email;
  personalinfo.Gender = Gender;
  personalinfo.CivilStatus = CivilStatus;
  personalinfo.Height = Height;
  personalinfo.Weight = Weight;
  personalinfo.Phone = Phone;
  personalinfo.Mobile = Mobile;
  personalinfo.Spouse = Spouse;
  personalinfo.FatherName = FatherName;
  personalinfo.Foccupation = Foccupation;
  personalinfo.MotherName = MotherName;
  personalinfo.Moccupation = Moccupation;

  const updatedPersonalInfo = await personalinfo.save();

  res.json({
    message: `Personal info of ${updatedPersonalInfo.EmployeeID} updated`,
  });
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

module.exports = { getAllPersonalInfo, createPersonalInfo, updatePersonalInfo };
