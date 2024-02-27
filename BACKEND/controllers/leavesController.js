const Leave = require("../models/Leave");
const Geninfo = require("../models/GenInfo");
const { format } = require("date-fns");

// desc Get all leaves
// @route GET /leaves
// @access Private
const getAllLeaves = async (req, res) => {
  const leaves = await Leave.find().lean();
  if (!leaves?.length) {
    return res.status(400).json({ message: "No leaves found" });
  }

  const geninfos = await Geninfo.find().lean();

  const newLeaves = leaves.map((leave) => {
    const match = geninfos.find(
      (geninfo) => geninfo.EmployeeID === leave.EmployeeID
    );

    return (leave = {
      ...leave,
      EmpName: `${match?.LastName ?? ""}, ${match?.FirstName ?? ""} ${
        match?.MI ?? ""
      }.`,
    });
  });

  res.json(newLeaves);
};

// desc Create new leave
// @route POST /leaves
// @access Private
const createLeave = async (req, res) => {
  const { ModifiedDate, DayTime, Approve, Lto, Remarks, Credited, ...others } =
    req.body;

  // Check if other properties of the request body has values
  const othersHasValues = Object.values(others).every((value) => value);

  // Some values are missing
  if (!othersHasValues) {
    return res.status(400).json({ message: "Some fields are missing values" });
  }

  /* Include duplicate checking if neccessary */

  // Proceed leave filing if conditions are met
  const leave = await Leave.create(req.body);

  // Extra checking if leave data is valid or not
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
