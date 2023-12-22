const Educ = require("../models/EducInfo");

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
  const reqBody = req.body;

  // Confirm data
  if (!reqBody.id) {
    return res.status(400).json({ message: "Id is required" });
  }

  const educ = await Educ.findById(reqBody.id).exec();

  if (!educ) {
    return res.status(404).json({ message: "Info not found" });
  }

  // Exclude variables that no needs to update before proceeding in updating
  const filteredData = { ...reqBody };
  delete filteredData?.id;
  delete filteredData?.EmployeeID;
  delete filteredData?._id;
  delete filteredData?.__v;

  /* // Check duplicate
  const duplicate = await GenInfo.findOne({ EmployeeID }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "EmployeeID already taken" });
  } */

  Object.assign(educ, filteredData);

  educ.save();

  res.json({
    message: `An educational info has been updated`,
  });
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
