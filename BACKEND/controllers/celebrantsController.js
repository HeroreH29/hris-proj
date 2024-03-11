const GenInfo = require("../models/GenInfo");
const PersonalInfo = require("../models/PersonalInfo");

// Get all celebrants of the current month
// GET /celebrants
const getAllCelebrants = async (req, res) => {
  // Current month
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  // Fetch all ACTIVE employees
  const geninfos = await GenInfo.find({ EmpStatus: "Y" }).lean();

  const personalinfos = await PersonalInfo.find().lean();

  const sortedPersonalInfos = personalinfos
    .sort((a, b) => {
      const bdayA = new Date(a.Birthday);
      const bdayB = new Date(b.Birthday);
      return bdayA.getDate() - bdayB.getDate();
    })
    .filter((personalinfo) => {
      const bmonth = new Date(personalinfo.Birthday).getMonth() + 1;
      return currentMonth === bmonth;
    })
    .reduce((acc, personalinfo) => {
      const birthday = new Date(personalinfo.Birthday);
      const isCurrentDay = birthday.getDate() === currentDay;

      return isCurrentDay
        ? [personalinfo, ...acc] // Move current day celebrants to the top
        : [...acc, personalinfo]; // Append others
    }, []);

  const celebrantsWithNames = sortedPersonalInfos
    .map((personalinfo) => {
      const match = geninfos.find((geninfo) => {
        return (
          geninfo.EmployeeID === personalinfo.EmployeeID &&
          geninfo.EmpStatus === "Y"
        );
      });

      if (!match) {
        return null;
      }

      return {
        birthday: personalinfo.Birthday,
        name: `${match.FirstName} ${match.LastName}`,
        branch: match.AssignedOutlet,
      };
    })
    .filter((entry) => entry !== null);

  res.json(celebrantsWithNames);
};

module.exports = { getAllCelebrants };
