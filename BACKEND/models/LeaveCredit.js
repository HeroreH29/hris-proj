const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveCreditSchema = new Schema({
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
  CreditBudget: {
    type: Number,
    default: 5,
  },
  CreditsOf: {
    type: Schema.Types.ObjectId,
    ref: "EmployeeRecord",
  },
});

module.exports = mongoose.model("LeaveCredit", leaveCreditSchema);
