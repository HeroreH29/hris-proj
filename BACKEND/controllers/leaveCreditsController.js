const LeaveCredit = require("../models/LeaveCredit");
const EmployeeRecord = require("../models/EmployeeRecord");
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
  const leavecredits = await LeaveCredit.find().populate({
    path: "Employee",
    select: "GenInfo",
    populate: {
      path: "GenInfo",
      select: "EmployeeID FirstName MI LastName DateEmployed EmpStatus",
      match: {
        EmpStatus: "Y",
      },
    },
  });

  if (!leavecredits?.length) {
    return res.status(400).json({ message: "No leave credits found" });
  }

  // Add Employee field
  const addEmployeeField = async () => {
    // Find all EmployeeRecords and populate the GenInfo field with EmployeeID
    const records = await EmployeeRecord.find().populate(
      "GenInfo",
      "EmployeeID"
    );

    // Iterate through each leave credit
    for (const credit of leavecredits) {
      // Find the record that matches the EmployeeID in leave credits
      const record = records.find(
        (record) => record.GenInfo.EmployeeID === credit.EmployeeID
      );

      // If a matching record is found
      if (record) {
        // Find the leave credit document in the database
        const leaveCreditDocument = await LeaveCredit.findOne({
          EmployeeID: credit.EmployeeID,
        });

        // Update the Employee field in the leave credit document
        if (leaveCreditDocument) {
          leaveCreditDocument.Employee = record._id;

          // Save the updated leave credit document back to the database
          await leaveCreditDocument.save();
        }
      }
    }
  };

  // Deactivate/Activate if needed
  //await addEmployeeField();

  reApplyCreditBudget(leavecredits);
  reUpdateLeaveCredits(leavecredits);

  res.json(leavecredits.filter((credit) => credit.Employee?.GenInfo !== null));
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
