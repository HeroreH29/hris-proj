const Dep = require("../models/Dependent");

// @desc Get all deps
// @route GET /dependents
// @access Private
const getAllDependents = async (req, res) => {
  const deps = await Dep.find().lean();
  if (!deps?.length) {
    return res.status(400).json({ message: "No deps found" });
  }
  res.json(deps);
};

// @desc Create new dep
// @route POST /dependents
// @access Private
const createDependent = async (req, res) => {
  const {
    EmployeeID,
    Names,
    Dependent,
    Birthday,
    Status,
    Relationship,
    Covered,
  } = req.body;

  // Confirm data
  if (
    !EmployeeID ||
    !Names ||
    !Dependent ||
    !Birthday ||
    !Status ||
    !Relationship ||
    !Covered
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Will put duplicate checker if needed/necessary

  // Create and store new user
  const dep = await Dep.create({
    EmployeeID,
    Names,
    Dependent,
    Birthday,
    Status,
    Relationship,
    Covered,
  });

  if (dep) {
    res.status(201).json({ message: `New dependent: ${Names} created` });
  } else {
    res.status(500).json({ message: "Invalid dependent data received" });
  }
};

// @desc Update dependent
// @route PATCH /users
// @access Private
const updateDependent = async (req, res) => {
  const { id, Names, Dependent, Birthday, Status, Relationship, Covered } =
    req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const dependent = await Dep.findById(id).exec();

  if (!dependent) {
    return res.status(400).json({ message: "Dependent not found" });
  }

  /* // Check duplicate
  const duplicate = await GenInfo.findOne({ EmployeeID }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "EmployeeID already taken" });
  } */

  dependent.Names = Names;
  dependent.Dependent = Dependent;
  dependent.Birthday = Birthday;
  dependent.Status = Status;
  dependent.Relationship = Relationship;
  dependent.Covered = Covered;

  const updatedDependent = await dependent.save();

  res.json({
    message: `Dependent - ${updatedDependent.Names} - has been updated`,
  });
};

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteDependent = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Dependent ID required" });
  }

  // Check if user exists to delete
  const dependent = await Dep.findById(id).exec();

  if (!dependent) {
    return res.status(400).json({ message: "Dependent not found" });
  }

  await dependent.deleteOne();

  const reply = `Dependent: ${dependent.Names} is deleted`;

  res.json(reply);
};

module.exports = {
  getAllDependents,
  createDependent,
  updateDependent,
  deleteDependent,
};
