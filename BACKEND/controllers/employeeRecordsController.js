const EmployeeRecord = require("../models/EmployeeRecord");
const GenInfo = require("../models/GenInfo");
const PersonalInfo = require("../models/PersonalInfo");
const Dependent = require("../models/Dependent");
const EducInfo = require("../models/EducInfo");
const WorkInfo = require("../models/WorkInfo");

const PopulateEmployeeRecord = async (res) => {
  const geninfo = await GenInfo.aggregate().project("_id EmployeeID");

  // Transform the data to match EmployeeRecord Schema
  const employeerecordsPromises = geninfo.map(async (doc) => {
    const employeeID = doc.EmployeeID;

    // Find one PersonalInfo document
    const pid = await PersonalInfo.findOne({ EmployeeID: employeeID }).exec();

    // Find all Dependent documents
    const did = await Dependent.find({ EmployeeID: employeeID }).exec();

    // Find all EducInfo documents
    const eid = await EducInfo.find({ EmployeeID: employeeID }).exec();

    // Find all WorkInfo documents
    const wid = await WorkInfo.find({ EmployeeID: employeeID }).exec();

    return {
      GenInfo: doc?._id,
      PersonalInfo: pid?._id,
      Dependent: did.map((dependent) => dependent?._id),
      EducInfo: eid.map((educ) => educ?._id),
      WorkInfo: wid.map((work) => work?._id),
    };
  });

  const employeerecord = (await Promise.all(employeerecordsPromises)).filter(
    (record) => record
  );

  employeerecord.forEach(async (record) => {
    await EmployeeRecord(record).save();
  });

  return res.json({ message: "Collection populated" });
};

// GET
const getEmployeeRecords = async (req, res) => {
  await PopulateEmployeeRecord(res);
  //console.log(employeerecord);
};

module.exports = { getEmployeeRecords };
