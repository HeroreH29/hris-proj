const LeaveCredit = require("../models/LeaveCredit");
const EmployeeRecord = require("../models/EmployeeRecord");
const {
  reApplyCreditBudget,
} = require("../xtra_functions/reApplyCreditBudget");
const {
  reUpdateLeaveCredits,
} = require("../xtra_functions/reUpdateLeaveCredits");
const { differenceInYears } = require("date-fns");

// desc Get all leavecredits
// @route GET /leavecredits
// @access Private
const getAllLeaveCredits = async (req, res) => {
  const leavecredits = await LeaveCredit.find().populate({
    path: "Employee",
    select: "GenInfo",
    populate: {
      path: "GenInfo",
      select:
        "EmployeeID FirstName MI LastName DateEmployed EmpStatus EmployeeType",
      match: {
        EmpStatus: "Y",
      },
    },
  });

  // Add Employee field
  const populateCollection = async () => {
    // Find all EmployeeRecords and populate the GenInfo field with EmployeeID
    const records = await EmployeeRecord.find().populate({
      path: "GenInfo",
      select: "EmpStatus EmployeeType DateEmployed",
      match: { EmployeeType: "Regular" },
    });

    const filteredRecords = records.filter((record) => record.GenInfo !== null);

    const getLeaveCreditData = (srvcYrs) => {
      if (srvcYrs >= 1 && srvcYrs <= 4) {
        return {};
      } else if (srvcYrs >= 5 && srvcYrs <= 7) {
        return { CreditBudget: 7, SickLeave: 7, VacationLeave: 7 };
      } else if (srvcYrs >= 8 && srvcYrs <= 10) {
        return { CreditBudget: 10, SickLeave: 10, VacationLeave: 10 };
      } else if (srvcYrs >= 11 && srvcYrs <= 13) {
        return { CreditBudget: 12, SickLeave: 12, VacationLeave: 12 };
      } else if (srvcYrs >= 14) {
        return { CreditBudget: 15, SickLeave: 15, VacationLeave: 15 };
      }
      return {
        CreditBudget: 0,
        SickLeave: 0,
        VacationLeave: 0,
        BirthdayLeave: 0,
        CreditBudget: 0,
      };
    };

    const processRecords = async (filteredRecords) => {
      // Store all create operations to run as a batch
      const createOperations = [];

      // Iterate through filtered records
      for (const record of filteredRecords) {
        // Check if a credit record exists for the current record
        const creditRecord = await LeaveCredit.findOne({
          Employee: record._id,
        });

        // If it exists, skip iteration
        if (creditRecord) {
          continue;
        }

        // Calculate service years
        const srvcYrs = differenceInYears(
          new Date(),
          new Date(record.GenInfo?.DateEmployed)
        );

        // Get leave credit data based on service years
        const leaveCreditData = getLeaveCreditData(srvcYrs);

        // If leave credit data is available, create a LeaveCredit record
        if (leaveCreditData) {
          createOperations.push(
            LeaveCredit.create({
              Employee: record._id,
              ...leaveCreditData,
            })
          );
        }
      }

      // Run all create operations as a batch
      await Promise.all(createOperations);
    };
    processRecords(filteredRecords);
  };

  if (!leavecredits?.length) {
    await populateCollection();
  }

  // Comment/Uncomment if needed
  res.json(leavecredits);

  //reApplyCreditBudget(leavecredits);
  //reUpdateLeaveCredits(leavecredits);

  //res.json(leavecredits.filter((credit) => credit.Employee?.GenInfo !== null));
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
  const { id, GenInfo, ...others } = req.body;

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
