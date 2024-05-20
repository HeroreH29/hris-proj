const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAccessSchema = new Schema({
  UserLevel: String,
  SysFeature: {
    Dashboard: {
      C: Boolean,
      R: Boolean,
      U: Boolean,
      D: Boolean,
    },
    EmployeeRecords: {
      C: Boolean,
      R: Boolean,
      U: Boolean,
      D: Boolean,
    },
    Attendances: {
      C: Boolean,
      R: Boolean,
      U: Boolean,
      D: Boolean,
    },
    Leaves: {
      C: Boolean,
      R: Boolean,
      U: Boolean,
      D: Boolean,
    },
    UserSettings: {
      C: Boolean,
      R: Boolean,
      U: Boolean,
      D: Boolean,
    },
  },
});

module.exports = mongoose.model("UserAccess", userAccessSchema);
