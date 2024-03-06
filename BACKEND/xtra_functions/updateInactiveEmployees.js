const GenInfo = require("../models/GenInfo");
const { parse, differenceInDays } = require("date-fns");

// Function to update records that are inactive or contract has ended
const updateInactiveEmployees = async (geninfos) => {
  geninfos
    .filter((g) => {
      const contractDateEnd = parse(
        g?.ContractDateEnd,
        "MMMM dd, yyyy",
        new Date()
      );
      const dateToday = new Date();
      const daysLeft = differenceInDays(contractDateEnd, dateToday);
      return g.EmpStatus === "N" || daysLeft < 1;
    })
    .forEach(async (g) => {
      await GenInfo.findOneAndUpdate(
        { EmployeeID: g.EmployeeID },
        {
          DateEmployed: "",
          DateProbationary: "",
          RegDate: "",
          EmpStatus: "N",
          ContractDateEnd: "",
        }
      ).exec();
    });
};

module.exports = { updateInactiveEmployees };
