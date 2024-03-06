const WorkInfo = require("../models/WorkInfo");
const { isStringAllNumbers } = require("../xtra_functions/isStringAllNumbers");

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

  const newEmployeeID = isStringAllNumbers(EmployeeID);

  // Will put duplicate checker if needed/necessary

  // Create and store new user
  const workinfo = await WorkInfo.create({
    EmployeeID: newEmployeeID,
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
  const { id, ...others } = req.body;
  let recordFound = false;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Id not provided" });
  }

  const workinfo = await WorkInfo.findById(id).exec();

  if (!workinfo) {
    recordFound = false;
    res.json({ message: "Work info not found. Creating new record..." });

    const newWork = new WorkInfo({ _id: id, ...others });
    newWork.save();
    res.json({ message: "Work info has been added" });
  } else {
    recordFound = true;
    Object.assign(workinfo, others);
    workinfo.save();
    res.json({ message: "Work info has been updated" });
  }
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
