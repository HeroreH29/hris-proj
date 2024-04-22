const Leave = require("../models/Leave");
const EmployeeRecord = require("../models/EmployeeRecord");
const { format } = require("date-fns");

// desc Get all leaves
// @route GET /leaves
// @access Private
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();

    for (const leave of leaves) {
      // Use for...of loop
      if (leave.Approve === 1) {
        leave.Credited = true;
        await leave.save();
      }
    }

    const employeeRecords = await EmployeeRecord.find().populate(
      "GenInfo",
      "EmployeeID"
    );

    for (const record of employeeRecords) {
      // If a record already has leave data, skip process below
      if (record.Leaves.length) {
        continue;
      }

      const foundLeaves = await Leave.find({
        EmployeeID: record?.GenInfo.EmployeeID,
      }).lean();

      record.Leaves = foundLeaves ? foundLeaves.map((leave) => leave._id) : [];

      await record.save();
    }

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: "GET LEAVES server error: " + error });
  }
};

// desc Create new leave
// @route POST /leaves
// @access Private
const createLeave = async (req, res) => {
  const {
    DateModified,
    DayTime,
    Approve,
    Lto,
    Remarks,
    Credited,
    Reason,
    ...others
  } = req.body;

  // Check if other properties of the request body has values
  const othersHasValues = Object.values(others).every(
    (value) => value || value !== null
  );

  // Some values are missing
  if (!othersHasValues) {
    return res.status(400).json({ message: "Some fields are missing values" });
  }

  /* Include duplicate checking if neccessary */

  // Proceed leave filing if conditions are met
  const leave = await Leave.create(req.body);

  // Add the filed leave to the employee record
  const records = await EmployeeRecord.find()
    .populate({
      path: "GenInfo",
      select: "EmployeeID",
    })
    .lean();

  const foundrecord = records.find(
    (record) => record.GenInfo.EmployeeID === others.EmployeeID
  );

  foundrecord.Leaves.push(leave._id);

  // Extra checking if leave data is valid or not
  // if (leave) {
  //   res.status(201).json(leave);
  // } else {
  //   res.status(500).json({ message: "Invalid leave data received" });
  // }
};

// desc Update leave
// @route PATCH /leaves
// @access Private
// Approve value equivalent: 0 = Pending; 1 = Approved; 2 = Declined; 3 = Cancelled
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
    res.json(updatedLeaveRecord);
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
