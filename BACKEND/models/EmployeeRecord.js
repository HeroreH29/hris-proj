const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeRecordSchema = new Schema({
  GenInfo: {
    type: Schema.Types.ObjectId,
    ref: "GenInfo",
  },
  PersonalInfo: {
    type: Schema.Types.ObjectId,
    ref: "PersonalInfo",
  },
  Dependents: {
    type: [Schema.Types.ObjectId],
    ref: "Dependent",
  },
  EducInfo: {
    type: [Schema.Types.ObjectId],
    ref: "EducInfo",
  },
  WorkInfo: {
    type: [Schema.Types.ObjectId],
    ref: "WorkInfo",
  },
  Leaves: {
    type: [Schema.Types.ObjectId],
    ref: "Leave",
  },
  LeaveCredits: {
    type: Schema.Types.ObjectId,
    ref: "LeaveCredit",
  },
});

module.exports = mongoose.model("EmployeeRecord", employeeRecordSchema);
