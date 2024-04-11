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
  Dependent: {
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
});

module.exports = mongoose.model("EmployeeRecord", employeeRecordSchema);
