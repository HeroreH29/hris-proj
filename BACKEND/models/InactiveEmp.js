const mongoose = require("mongoose");

const inactiveEmpSchema = new mongoose.Schema({
  EmployeeID: {
    type: Object,
    required: true,
  },
  Mode_of_Separation: {
    type: String,
    default: "",
  },
  DateAdd: {
    type: String,
    required: true,
  },
  UserName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("InactiveEmp", inactiveEmpSchema);
