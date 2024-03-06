const LeaveCredit = require("../models/LeaveCredit");

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
};

module.exports = { reApplyCreditBudget };
