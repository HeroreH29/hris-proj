const Leave = require("../models/Leave");
const LeaveCredit = require("../models/LeaveCredit");
const GenInfo = require("../models/GenInfo");
const { format } = require("date-fns");

// desc Get all leaves
// @route GET /leaves
// @access Private
const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("FiledFor").lean();

    /* FOR REASSIGNING GENINFO REFERENCE */
    for (const leave of leaves) {
      if (!leave.EmployeeID) {
        continue;
      } else if (
        leave.FiledFor &&
        leave.FiledBy &&
        leave.DateFiled &&
        leave.DateModified
      ) {
        continue;
      }

      const foundGenInfo = await GenInfo.findOne({
        EmployeeID: leave.EmployeeID,
      });

      // if (!foundGenInfo) res.status(404).json({ message: "GenInfo not found" });

      leave.FiledFor = foundGenInfo?._id;
      leave.FiledBy = leave.User;
      leave.DateFiled = leave.AddDate;
      leave.DateModified = leave.DateApproved;

      await Leave.findByIdAndUpdate(leave._id, leave);
    }

    const updatedLeaves = await Leave.find().populate("FiledFor");

    res.json(updatedLeaves.sort(() => -1));
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
// Approve value equivalent: 1 = Approved; 2 = Cancelled; 3 = Pending;
const updateLeave = async (req, res) => {
  const { leave, Approve, Remarks, leaveCredit } = req.body;

  if (!leave.id) {
    return res.status(400).json({ message: "Leave 'id' is required" });
  }

  // Update modification date
  leave.DateModified = format(new Date(), "Ppp");

  // Revert the used credit if leave is cancelled...
  if (Approve === 2 && leave.Approve === 1) {
    const leaveType = leave.Ltype.replace(" ", "");

    const revertedCredit = leaveCredit[leaveType] + leave.NoOfDays;

    if (revertedCredit > leave.CreditBudget) {
      leaveCredit[leaveType] = leaveCredit.CreditBudget;
    } else {
      leaveCredit[leaveType] = revertedCredit;
    }

    leave.Credited = false;

    // Save changes to Leave Credit
    await LeaveCredit.findByIdAndUpdate(leaveCredit.id, leaveCredit);
  }

  leave.Approve = Approve;
  leave.Remarks = Remarks;

  const updatedLeave = await Leave.findByIdAndUpdate(leave.id, leave, {
    new: true,
  });

  if (updatedLeave) {
    res.json("Leave updated successfully!");
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
