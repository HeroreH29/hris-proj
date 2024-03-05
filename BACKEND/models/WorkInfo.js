const mongoose = require("mongoose");

const workInfoSchema = new mongoose.Schema({
  EmployeeID: {
    type: Object,
    required: true,
  },
  Position_Title: {
    type: String,
    required: true,
  },
  Company_Name: {
    type: String,
    required: true,
  },
  JoinedFR_M: {
    type: String,
    required: true,
  },
  JoinedFR_Y: {
    type: Number,
    required: true,
  },
  JoinedTO_M: {
    type: String,
    default: "",
  },
  JoinedTO_Y: {
    type: Number,
    default: 0,
  },
  Specialization: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    required: true,
  },
  Country: {
    type: String,
    required: true,
  },
  State: {
    type: String,
    required: true,
  },
  Industry: {
    type: String,
    required: true,
  },
  Position: {
    type: String,
    required: true,
  },
  Salary: {
    type: String,
    default: "",
  },
  Work_Description: {
    type: String,
    required: true,
  },
  ToPresent: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("WorkInfo", workInfoSchema);
