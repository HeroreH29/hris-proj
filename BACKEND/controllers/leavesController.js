const Leave = require("../models/Leave");
const LeaveCredit = require("../models/LeaveCredit");
const GenInfo = require("../models/GenInfo");
const { format } = require("date-fns");

// desc Get all leaves
// @route GET /leaves
// @access Private
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("FiledFor");

    /* FOR UPDATING CREDITED STATUS */
    // for (const leave of leaves) {
    //   const foundCredit = await LeaveCredit.find({
    //     CreditsOf: leave.FiledFor,
    //   }).exec();

    //   if (
    //     leave.Approve === 1 &&
    //     leave.DateFiled &&
    //     foundCredit.CreditBudget > 0
    //   ) {
    //     leave.Credited = true;
    //     await leave.save();
    //   }
    // }

    /* FOR REASSIGNING GENINFO REFERENCE */

    // for (const leave of leaves) {
    //   if (!leave.EmployeeID) {
    //     continue;
    //   }

    //   const foundGenInfo = await GenInfo.findOne({
    //     EmployeeID: leave.EmployeeID,
    //   });

    //   // if (!foundGenInfo) res.status(404).json({ message: "GenInfo not found" });

    //   leave.FiledFor = foundGenInfo?._id;

    //   await leave.save();
    // }

    /* FOR RECALCULATING APPROVED LEAVES FOR LEAVE CREDITS */

    // const currentYearLeaves = leaves.filter((leave) =>
    //   leave.DateFiled.includes(new Date().getFullYear().toString())
    // );

    // for (const leave of currentYearLeaves) {
    //   if (leave.Approve === 1) {
    //     const leaveType = leave.Ltype.replace(" ", "");

    //     const foundLeaveCredit = await LeaveCredit.findOne({
    //       CreditsOf: leave.FiledFor,
    //     });

    //     if (foundLeaveCredit?.CreditBudget > 0) {
    //       foundLeaveCredit[leaveType] -= leave.NoOfDays;
    //       await foundLeaveCredit.save();
    //     }
    //   }
    // }

    res.json(leaves.sort(() => -1));
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

  // Extra checking if leave and record data is valid or not
  if (leave) {
    res.status(201).json(leave);
  } else {
    res.status(500).json({ message: "Invalid leave data received" });
  }
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
  others.DateModified = format(new Date(), "Ppp");

  const leaveRecord = await Leave.findByIdAndUpdate(id, others, {
    new: true,
  }).exec();

  // // Update modification date to the current date
  // leaveRecord.DateModified = format(new Date(), "Ppp");

  // const updatedLeaveRecord = await leaveRecord.save();

  if (leaveRecord) {
    res.json(leaveRecord);
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
