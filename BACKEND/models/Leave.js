const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  DateOfFilling: {
    type: String,
    required: true,
  },
  NoOfDays: {
    type: Number,
    required: true,
  },
  DayTime: {
    type: String,
    default: "",
  },
  Lfrom: {
    type: String,
    requried: true,
  },
  Lto: {
    type: String,
    required: true,
  },
  Reason: {
    type: String,
    required: true,
  },
  Remarks: {
    type: String,
    default: "",
  },
  Approve: {
    type: Number,
    default: 0,
  },
  User: {
    type: String,
    required: true,
  },
  AddDate: {
    type: String,
    required: true,
  },
  ModifiedDate: {
    type: String,
    default: "",
  },
  EmployeeID: {
    type: Object,
    required: true,
  },
  EmpBioID: {
    type: Number,
    required: true,
  },
  PayMe: {
    type: Number,
    required: true,
  },
  Remain: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Leave", leaveSchema);
