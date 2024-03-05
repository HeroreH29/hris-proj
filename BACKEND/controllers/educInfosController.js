const Educ = require("../models/EducInfo");

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

// @desc Get all educinfos
// @route GET /educinfos
// @access Private
const getAllEducInfos = async (req, res) => {
  const educ = await Educ.find().lean();
  if (!educ?.length) {
    return res.status(400).json({ message: "No info found" });
  }
  res.json(educ);
};

// @desc Create new educ info
// @route POST /educinfos
// @access Private
const createEducInfo = async (req, res) => {
  const reqBody = req.body;

  // Confirm data
  for (const field in reqBody) {
    if (!reqBody[field]) {
      return res.status(400).json({ message: "All fields are required" });
    }
  }

  const newEmployeeID = isStringAllNumber(reqBody.EmployeeID);
  reqBody.EmployeeID = newEmployeeID;

  // Will put duplicate checker if needed/necessary

  // Create and store new info
  const educ = await Educ.create(reqBody);

  if (educ) {
    res.status(201).json({ message: `New education info created` });
  } else {
    res.status(500).json({ message: "Invalid educational info received" });
  }
};

// @desc Update educinfo
// @route PATCH /educinfos
// @access Private
const updateEducInfo = async (req, res) => {
  const { id, _id, __v, ...others } = req.body;
  let recordFound = false;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  const educ = await Educ.findById(id).exec();

  if (!educ) {
    recordFound = false;
    res.json({ message: "Info not found. Creating a new record..." });

    const newEduc = new Educ({ _id: id, ...others });
    newEduc.save();
    res.json({ message: "Educational info has been added" });
  } else {
    recordFound = true;
    // Continue with updating the record
    Object.assign(educ, others);
    educ.save();
    res.json({ message: "An educational info has been updated" });
  }
};

// @desc Delete educ info
// @route DELETE /educinfos
// @access Private
const deleteEducInfo = async (req, res) => {
  const reqBodyId = req.body.id;

  if (!reqBodyId) {
    return res.status(400).json({ message: "ID required" });
  }

  // Check if info exists to delete
  const educ = await Educ.findById(reqBodyId).exec();

  if (!educ) {
    return res.status(400).json({ message: "Info not found" });
  }

  await educ.deleteOne();

  const reply = `Educational info has been deleted`;

  res.json(reply);
};

module.exports = {
  getAllEducInfos,
  createEducInfo,
  updateEducInfo,
  deleteEducInfo,
};
