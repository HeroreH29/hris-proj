const InactiveEmp = require("../models/InactiveEmp");

const { format, parse } = require("date-fns");

// @desc Get all inactive emps
// @route GET /inactiveemps
// @access Private
const getAllInactiveEmps = async (req, res) => {
  const inactiveEmps = await InactiveEmp.find().lean();
  if (!inactiveEmps?.length) {
    return res.status(400).json({ message: "No Inactive Employees found" });
  }

  res.json(inactiveEmps);
};

// @desc Create inactive emp
// @route POST /inactiveemps
// @access Private
const createInactiveEmp = async (req, res) => {
  const { Mode_of_Separation, ...others } = req.body;

  // Check if other properties of the request body has values
  const othersHasValues = Object.values(others).every(
    (value) => value !== "" || value
  );

  // Some values are missing
  if (!othersHasValues) {
    return res.status(400).json({ message: "Some fields are missing values" });
  }

  // Check for duplicate inactive employee
  const duplicate = await InactiveEmp.findOne({ EmployeeID: others.EmployeeID })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Inactive employee already exists" });
  }

  // Add DateAdd variable to match other records
  req.body = { ...req.body, DateAdd: format(new Date(), "M/d/yyyy") };

  // Add and store new inactive employee
  const inactiveEmp = await InactiveEmp.create(req.body);

  if (inactiveEmp) {
    return res.status(201).json({ message: `Inactive employee is added` });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid inactive employee data received" });
  }
};

// @desc Update inactive emp
// @route PATCH /inactiveemps
// @access Private
const updateInactiveEmp = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Information 'id' is required" });
  }

  const inactiveEmp = await InactiveEmp.findById(id).exec();

  if (!inactiveEmp) {
    return res.status(400).json({ message: "Information not found" });
  }

  const updatedInactiveEmp = await inactiveEmp.save();

  if (updatedInactiveEmp) {
    res.json({
      message: `Information of ${updatedInactiveEmp.EmployeeID} updated`,
    });
  } else {
    res.json({ message: "Something went wrong" });
  }
};

// @desc Delete inactive emp
// @route DELETE /inactiveemps
// @access Private
const deleteInactiveEmp = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  // Check if user exists to delete
  const inactiveEmp = await InactiveEmp.findById(id).exec();

  if (!inactiveEmp) {
    return res.status(400).json({ message: "Record not found" });
  }

  await inactiveEmp.deleteOne();

  const reply = `Inactive employee removed from record list`;

  res.json(reply);
};

module.exports = {
  getAllInactiveEmps,
  createInactiveEmp,
  updateInactiveEmp,
  deleteInactiveEmp,
};
