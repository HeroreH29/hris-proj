const WorkInfo = require("../models/WorkInfo");

// @desc Get all work infos
// @route GET /workinfos
// @access Private
const getAllWorkInfo = async (req, res) => {
  const workinfo = await WorkInfo.find().lean();
  if (!workinfo?.length) {
    return res.status(400).json({ message: "No work info found" });
  }
  res.json(workinfo);
};

// @desc Create new work info
// @route POST /workinfos
// @access Private
const createWorkInfo = async (req, res) => {
  const {
    EmployeeID,
    Position_Title,
    Company_Name,
    JoinedFR_M,
    JoinedFR_Y,
    JoinedTO_M,
    JoinedTO_Y,
    Specialization,
    Role,
    Country,
    State,
    Industry,
    Position,
    Salary,
    Work_Description,
    ToPresent,
  } = req.body;

  // Confirm data
  if (
    !EmployeeID &&
    !Position_Title &&
    !Company_Name &&
    !JoinedFR_M &&
    !JoinedFR_Y &&
    !JoinedTO_M &&
    !JoinedTO_Y &&
    !Specialization &&
    !Role &&
    !Country &&
    !State &&
    !Industry &&
    !Position &&
    !Work_Description
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Will put duplicate checker if needed/necessary

  // Create and store new user
  const workinfo = await WorkInfo.create({
    EmployeeID,
    Position_Title,
    Company_Name,
    JoinedFR_M,
    JoinedFR_Y,
    JoinedTO_M,
    JoinedTO_Y,
    Specialization,
    Role,
    Country,
    State,
    Industry,
    Position,
    Salary,
    Work_Description,
    ToPresent,
  });

  if (workinfo) {
    res.status(201).json({ message: `New work info created` });
  } else {
    res.status(500).json({ message: "Invalid work info data received" });
  }
};

// @desc Update dependent
// @route PATCH /users
// @access Private
const updateWorkInfo = async (req, res) => {
  const {
    id,
    Position_Title,
    Company_Name,
    JoinedFR_M,
    JoinedFR_Y,
    JoinedTO_M,
    JoinedTO_Y,
    Specialization,
    Role,
    Country,
    State,
    Industry,
    Position,
    Salary,
    Work_Description,
    ToPresent,
  } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Id not provided" });
  }

  const workinfo = await WorkInfo.findById(id).exec();

  if (!workinfo) {
    return res.status(400).json({ message: "Work info not found" });
  }

  /* // Check duplicate
  const duplicate = await GenInfo.findOne({ EmployeeID }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "EmployeeID already taken" });
  } */

  workinfo.Position_Title = Position_Title;
  workinfo.Company_Name = Company_Name;
  workinfo.JoinedFR_M = JoinedFR_M;
  workinfo.JoinedFR_Y = JoinedFR_Y;
  workinfo.JoinedTO_M = JoinedTO_M;
  workinfo.JoinedTO_Y = JoinedTO_Y;
  workinfo.Specialization = Specialization;
  workinfo.Role = Role;
  workinfo.Country = Country;
  workinfo.State = State;
  workinfo.Industry = Industry;
  workinfo.Position = Position;
  workinfo.Salary = Salary;
  workinfo.Work_Description = Work_Description;
  workinfo.ToPresent = ToPresent;

  await workinfo.save();

  res.json({
    message: `Work Info has been updated`,
  });
};

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteWorkInfo = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Id required" });
  }

  // Check if user exists to delete
  const workinfo = await WorkInfo.findById(id).exec();

  if (!workinfo) {
    return res.status(400).json({ message: "Work info not found" });
  }

  await workinfo.deleteOne();

  const reply = `Work info is deleted`;

  res.json(reply);
};

module.exports = {
  getAllWorkInfo,
  createWorkInfo,
  updateWorkInfo,
  deleteWorkInfo,
};
