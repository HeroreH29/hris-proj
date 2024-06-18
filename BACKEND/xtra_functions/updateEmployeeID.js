const PersonalInfo = require("../models/PersonalInfo");
const Dependent = require("../models/Dependent");
const EducInfo = require("../models/EducInfo");
const WorkInfo = require("../models/WorkInfo");
const Leave = require("../models/Leave");
const InactiveEmp = require("../models/InactiveEmp");
const TraniningHistory = require("../models/TrainingHistory");
const TrainingHistory = require("../models/TrainingHistory");

const updateEmployeeID = async (origEmployeeID, newEmployeeID) => {
  // Fetch documents from other informations using EmployeeID
  const personalinfo = await PersonalInfo.findOne({
    EmployeeID: origEmployeeID,
  }).exec();

  const dependent = await Dependent.find({
    EmployeeID: origEmployeeID,
  }).exec();

  const educinfo = await EducInfo.find({
    EmployeeID: origEmployeeID,
  }).exec();

  const workinfo = await WorkInfo.find({
    EmployeeID: origEmployeeID,
  }).exec();

  const leaveRecord = await Leave.find({
    EmployeeID: origEmployeeID,
  }).exec();

  const leaveCreditRecord = await LeaveCredit.findOne({
    EmployeeID: origEmployeeID,
  }).exec();

  const inactiveEmpRecord = await InactiveEmp.findOne({
    EmployeeID: origEmployeeID,
  }).exec();

  const trainingHistories = await TrainingHistory.findOne({
    EmployeeID: origEmployeeID,
  }).exec();

  // Apply changes to other informations
  if (personalinfo) {
    personalinfo.EmployeeID = newEmployeeID;
    await personalinfo.save();
  }

  if (dependent?.length) {
    dependent.forEach(async (dep) => {
      dep.EmployeeID = newEmployeeID;
      await dep.save();
    });
  }

  if (educinfo?.length) {
    educinfo.forEach(async (educ) => {
      educ.EmployeeID = newEmployeeID;
      await educ.save();
    });
  }

  if (workinfo?.length) {
    workinfo.forEach(async (work) => {
      work.EmployeeID = newEmployeeID;
      await work.save();
    });
  }

  if (leaveRecord?.length) {
    leaveRecord.forEach(async (leave) => {
      leave.EmployeeID = newEmployeeID;
      await leave.save();
    });
  }

  if (leaveCreditRecord) {
    leaveCreditRecord.EmployeeID = newEmployeeID;
    await leaveCreditRecord.save();
  }

  if (inactiveEmpRecord) {
    inactiveEmpRecord.EmployeeID = newEmployeeID;
    await inactiveEmpRecord.save();
  }

  if (trainingHistories) {
    trainingHistories.forEach(async (history) => {
      history.EmployeeID = newEmployeeID;
      await history.save();
    });
  }
};

module.exports = { updateEmployeeID };
