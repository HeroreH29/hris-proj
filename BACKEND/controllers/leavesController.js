const Leave = require("../models/Leave");
const EmployeeRecord = require("../models/EmployeeRecord");
const { format } = require("date-fns");

// desc Get all leaves
// @route GET /leaves
// @access Private
const getAllLeaves = async (req, res) => {
  // const currentYear = new Date().getFullYear();
  // const previousYear = currentYear - 1;

  // Fetch all leaves and employees
  const [leaves, employees] = await Promise.all([
    Leave.find().populate({
      path: "FiledFor",
      select: "GenInfo",
      populate: {
        path: "GenInfo",
        select: "FirstName MI LastName DateEmployed EmployeeID AssignedOutlet", // Specify any nested fields you want to populate
      },
    }),
    EmployeeRecord.find().populate("GenInfo", "EmployeeID").lean(),
  ]);

  // Create a map of employees for faster lookup
  // const employeeMap = new Map();
  // employees.forEach((employee) => {
  //   employeeMap.set(employee.GenInfo.EmployeeID, employee);
  // });

  // // Array to store update operations for batch update
  // const updateOperations = [];

  // // Process leaves
  // leaves.forEach((leave) => {
  //   // Determine credited status based on approve field
  //   leave.Credited = leave.Approve === 1;

  //   // Find the corresponding employee
  //   const employee = employeeMap.get(leave.EmployeeID);
  //   if (employee) {
  //     leave.FiledFor = employee._id;
  //   }

  //   // Add update operation
  //   updateOperations.push({
  //     updateOne: {
  //       filter: { _id: leave._id },
  //       update: leave,
  //     },
  //   });
  // });

  // // Perform batch update
  // if (updateOperations.length > 0) {
  //   await Leave.bulkWrite(updateOperations);
  // }

  // Respond with populated leaves
  res.json(leaves);
};

// desc Create new leave
// @route POST /leaves
// @access Private
const createLeave = async (req, res) => {
  const {
    ModifiedDate,
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
