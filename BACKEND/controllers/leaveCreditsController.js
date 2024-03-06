const LeaveCredit = require("../models/LeaveCredit");
const {
  reApplyCreditBudget,
} = require("../xtra_functions/reApplyCreditBudget");
const {
  reUpdateLeaveCredits,
} = require("../xtra_functions/reUpdateLeaveCredits");

// desc Get all leavecredits
// @route GET /leavecredits
// @access Private
const getAllLeaveCredits = async (req, res) => {
  const leavecredits = await LeaveCredit.find().lean();
  if (!leavecredits?.length) {
    return res.status(400).json({ message: "No leave credits found" });
  }

  reApplyCreditBudget(leavecredits);
  reUpdateLeaveCredits(leavecredits);

  res.json(leavecredits);
};

// desc Create new leave credit
// @route POST /leavecredits
// @access Private
const createLeaveCredit = async (req, res) => {
  const { EmployeeID } = req.body;

  // Check if EmployeeID does not exist
  if (!EmployeeID) {
    return res.status(400).json({ message: "EmployeeID is required" });
  }

  // Check for duplicates
  const duplicate = await LeaveCredit.exists({ EmployeeID: EmployeeID }).exec();
  if (duplicate) {
    return res.status(409).json({
      message: "Leave Credit record already exist!",
    });
  }

  // Proceed creation of leave credit if conditions are met
  const newLeaveCredit = await LeaveCredit.create(req.body);

  // Extra checking if leave data is valid or not
  if (newLeaveCredit) {
    res.status(201).json({ message: `New leave credit created` });
  } else {
    res.status(500).json({ message: "Invalid leave credit data received" });
  }
};

// desc Update leave credit
// @route PATCH /leavecredits
// @access Private
const updateLeaveCredit = async (req, res) => {
  const { id, ...others } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Leave credit 'id' is required" });
  }

  const leaveCreditRecord = await LeaveCredit.findByIdAndUpdate(id, others, {
    new: true,
  }).exec();

  const updatedLeaveCredit = await leaveCreditRecord.save();

  if (updatedLeaveCredit) {
    res.json({
      message: `Leave credit updated`,
    });
  } else {
    res.json({ message: "Something went wrong" });
  }
};

// desc Delete leave
// @route DELETE /leaves
// @access Private
const deleteLeaveCredit = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Leave credit 'id' is required" });
  }

  const deletedLeaveCredit = await LeaveCredit.findByIdAndDelete(id);

  if (deletedLeaveCredit) {
    res.json({ message: "Leave credit deleted" });
  } else {
    res.json({
      message: "Leave credit is not found. Deletion process cancelled",
    });
  }
};

module.exports = {
  getAllLeaveCredits,
  createLeaveCredit,
  updateLeaveCredit,
  deleteLeaveCredit,
};
