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

module.exports = { getAllWorkInfo, createWorkInfo };
