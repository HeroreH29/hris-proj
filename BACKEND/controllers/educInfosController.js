const Educ = require("../models/EducInfo");
const { isStringAllNumbers } = require("../xtra_functions/isStringAllNumbers");

// @desc Get all educinfos
// @route GET /educinfos
// @access Private
const getAllEducInfos = async (req, res) => {
  const educ = await Educ.find().lean();
  if (!educ?.length) {
    return res.status(400).json({ message: "No educ info found" });
  }
  res.json(educ);
};

// @desc Create new educ info
// @route POST /educinfos
// @access Private
const createEducInfo = async (req, res) => {
  const { Major, Field_of_Study, Degree, ...others } = req.body;

  const othersHasValues = Object.values(others).every(
    (value) => value !== "" && value !== null
  );

  // Confirm data
  if (!othersHasValues) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newEmployeeID = isStringAllNumbers(req.body.EmployeeID);
  req.body.EmployeeID = newEmployeeID;

  // Will put duplicate checker if needed/necessary

  // Create and store new info
  const educ = await Educ.create(req.body);

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
  const othersId = req.body.id;

  if (!othersId) {
    return res.status(400).json({ message: "ID required" });
  }

  // Check if info exists to delete
  const educ = await Educ.findById(othersId).exec();

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
