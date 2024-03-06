const Leave = require("../models/Leave");
const LeaveCredit = require("../models/LeaveCredit");

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

module.exports = { reUpdateLeaveCredits };
