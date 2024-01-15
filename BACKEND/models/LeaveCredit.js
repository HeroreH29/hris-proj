const mongoose = require("mongoose");

const leaveCreditSchema = new mongoose.Schema({
  EmployeeID: {
    type: String,
    required: true,
  },
  SickLeave: {
    type: Number,
    default: 5,
  },
  VacationLeave: {
    type: Number,
    default: 5,
  },
  MaternityLeave: {
    type: Number,
    default: 0,
  },
  PaternityLeave: {
    type: Number,
    default: 0,
  },
  BirthdayLeave: {
    type: Number,
    default: 1,
  },
  MatrimonialLeave: {
    type: Number,
    default: 0,
  },
  BereavementLeave: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("LeaveCredit", leaveCreditSchema);
