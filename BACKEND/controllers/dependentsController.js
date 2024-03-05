const Dep = require("../models/Dependent");

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
    !Birthday ||
    !Status ||
    !Relationship ||
    !Covered
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newEmployeeID = isStringAllNumber(EmployeeID);

  // Will put duplicate checker if needed/necessary

  // Create and store new user
  const dep = await Dep.create({
    EmployeeID: newEmployeeID,
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
  const { id, ...others } = req.body;

  let recordFound = false;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }

  const dependent = await Dep.findById(id).exec();

  if (!dependent) {
    recordFound = false;
    res.json({ message: "Info not found. Creating a new record..." });

    const newDep = new Dep({ _id: id, ...others });
    newDep.save();
    res.json({ message: "Dependent info has been added" });
  } else {
    recordFound = true;
    Object.assign(dependent, others);
    dependent.save();
    res.json({ message: "A dependent info has been updated" });
  }
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
