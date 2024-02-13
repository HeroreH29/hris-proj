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
  Ltype: {
    type: String,
    required: true,
  },
  Lfrom: {
    type: String,
    required: true,
  },
  Lto: {
    type: String,
    default: "",
  },
  Reason: {
    type: String,
    default: "",
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
  ModifiedDate: {
    type: String,
    default: "",
  },
  EmployeeID: {
    type: Object,
    required: true,
  },
  Credited: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Leave", leaveSchema);
