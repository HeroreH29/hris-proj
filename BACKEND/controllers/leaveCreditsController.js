const LeaveCredit = require("../models/LeaveCredit");
const Leave = require("../models/Leave");
const GenInfo = require("../models/GenInfo");
const { differenceInYears } = require("date-fns");

// desc Get all leavecredits
// @route GET /leavecredits
// @access Private
const getAllLeaveCredits = async (req, res) => {
  const leavecredits = await LeaveCredit.find().populate("CreditsOf");

  // Populating the collection
  if (!leavecredits.length) {
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

    const genInfos = await GenInfo.find(
      { EmpStatus: "Y" },
      "DateEmployed EmpStatus"
    );

    for (const info of genInfos) {
      const srvcYrs = differenceInYears(
        new Date(),
        new Date(info.DateEmployed)
      );
      const creditData = getLeaveCreditData(srvcYrs);

      if (creditData) {
        await LeaveCredit.create({
          ...creditData,
          CreditsOf: info._id,
        });
      }
    }
  }

  // Recalculating the credits based on latest/recent filed leave of the current year
  if (leavecredits.length) {
    for (const credit of leavecredits) {
      const matchingLeaves = await Leave.find({
        FiledFor: credit.CreditsOf,
        DateModified: { $regex: "2024" },
        Approve: 1,
      })
        .populate("FiledFor")
        .exec();

      if (!matchingLeaves.length) continue;

      for (const leave of matchingLeaves) {
        const dateEmployed = new Date(leave.FiledFor?.DateEmployed);
        const supposedCreditIncreaseDate = new Date(dateEmployed);
        supposedCreditIncreaseDate.setFullYear(
          supposedCreditIncreaseDate.getFullYear() + 1
        );
        const leaveDateFiled = new Date(leave.DateFiled);

        // Check if leave is NOT credited and date filed is greater than supposed 1 year of service of an employee
        if (!leave?.Credited && leaveDateFiled > supposedCreditIncreaseDate) {
          const ltype = leave.Ltype.replace(" ", "");
          const creditCalculation = credit[ltype] - leave.NoOfDays;
          if (creditCalculation < 0) {
            credit[ltype] = 0;
          } else {
            credit[ltype] = creditCalculation;
          }
          leave.Credited = true;

          // Save changes
          await leave.save();
        }
      }

      // Save changes
      await credit.save();
    }
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

  if (leaveCreditRecord) {
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
