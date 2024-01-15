const Leave = require("../models/Leave");
const { format } = require("date-fns");

// desc Get all leaves
// @route GET /leaves
// @access Private
const getAllLeaves = async (req, res) => {
  const leaves = await Leave.find().lean();
  if (!leaves?.length) {
    return res.status(400).json({ message: "No leaves found" });
  }
  res.json(leaves);
};

// desc Create new leave
// @route POST /leaves
// @access Private
const createLeave = async (req, res) => {
  const { ModifiedDate, DayTime, DateApproved, Approve, ...others } = req.body;

  // Check if other properties of the request body has values
  const othersHasValues = Object.values(others).every((value) => value !== "");

  // Some values are missing
  if (!othersHasValues) {
    return res.status(400).json({ message: "All fields are required" });
  }

  /* Include duplicate checking if neccessary */

  // Proceed leave filing if conditions are met
  const leave = await Leave.create(req.body);

  // Extra checking if leave data is valid or not
  if (leave) {
    res.status(201).json({ message: `New leave filed` });
  } else {
    res.status(500).json({ message: "Invalid leave data received" });
  }
};

// desc Update leave
// @route PATCH /leaves
// @access Private
const updateLeave = async (req, res) => {
  const { id, ...others } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Leave 'id' is required" });
  }

  /* Include duplicate checking if neccessary */

  const leaveRecord = await Leave.findByIdAndUpdate(id, others, {
    new: true,
  }).exec();
  leaveRecord.ModifiedDate = format(new Date(), "Ppp");

  const updatedLeaveRecord = await leaveRecord.save();

  if (updatedLeaveRecord) {
    res.json({
      message: `Leave record updated`,
    });
  } else {
    res.json({ message: "Something went wrong" });
  }
};

// desc Delete leave
// @route DELETE /leaves
// @access Private
const deleteLeave = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Leave 'id' is required" });
  }

  const deletedLeaveRecord = await Leave.findByIdAndDelete(id);

  if (deletedLeaveRecord) {
    res.json({ message: "Leave record deleted" });
  } else {
    res.json({
      message: "Leave record is not found. Deletion process cancelled",
    });
  }
};

module.exports = { getAllLeaves, createLeave, updateLeave, deleteLeave };