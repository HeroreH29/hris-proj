const LeaveCredit = require("../models/LeaveCredit");
const Leave = require("../models/Leave");

// Updating leave credits especially for new filed leaves
const reUpdateLeaveCredits = async (leavecredits) => {
  const leaves = await Leave.find().lean();

  if (leaves?.length) {
    // Get all leaves that are filed and approved within the current year
    const currentYearLeaves = leaves.filter((leave) => {
      return (
        leave?.DateOfFilling?.includes(new Date().getFullYear().toString()) &&
        leave?.Approve === 1
      );
    });

    /* Filter out leaves within the year to match a leave credit record based on EmployeeID.
    Apply the necessary changes to the credits and update the data from the database afterwards. */
    const matchingLeaves = currentYearLeaves.filter((leave) => {
      const credit = leavecredits.find(
        (credit) => credit.EmployeeID === leave.EmployeeID
      );
      return credit;
    });

    matchingLeaves.map(async (leave) => {
      const credit = leavecredits.find(
        (credit) => credit.EmployeeID === leave.EmployeeID
      );

      if (
        credit &&
        (leave.Credited === false || leave.Credited === undefined)
      ) {
        const possibleResult =
          credit[leave.Ltype.replace(/\s+/g, "")] - leave.NoOfDays;

        if (possibleResult > 0) {
          credit[leave.Ltype.replace(/\s+/g, "")] -= leave.NoOfDays;
        } else {
          credit[leave.Ltype.replace(/\s+/g, "")] = 0;
        }
      }

      // Save credit changes to database
      const SaveCreditChanges = async () => {
        const { _id, __v, ...others } = credit;

        const leaveCreditRecord = await LeaveCredit.findByIdAndUpdate(
          _id,
          others,
          {
            new: true,
          }
        ).exec();

        if (leaveCreditRecord) {
          await leaveCreditRecord.save();
        }
      };
      SaveCreditChanges(); // Call the function

      // Mark leave as credited
      const MarkLeaveAsCredited = async () => {
        leave = { ...leave, Credited: true };

        const { _id, __v, ...others } = leave;

        const leaveRecord = await Leave.findByIdAndUpdate(_id, others, {
          new: true,
        }).exec();

        if (leaveRecord) {
          await leaveRecord.save();
        }
      };
      MarkLeaveAsCredited(); // Call the function
    });
  }
};

// Applying credit budget field on leave credits that still do not have it
const reApplyCreditBudget = async (leavecredits) => {
  leavecredits.forEach(async (credit) => {
    if (credit.CreditBudget === undefined) {
      credit = {
        ...credit,
        CreditBudget: credit.SickLeave || credit.VacationLeave,
      };

      const { _id, __v, ...others } = credit;

      const leaveCreditRecord = await LeaveCredit.findByIdAndUpdate(
        _id,
        others,
        {
          new: true,
        }
      ).exec();

      await leaveCreditRecord.save();
    }
  });

  console.log("Budget re-applied");
};

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
