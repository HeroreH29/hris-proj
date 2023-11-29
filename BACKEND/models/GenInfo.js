const mongoose = require("mongoose");

const genInfoSchema = new mongoose.Schema({
  EmployeeID: {
    type: String,
    required: true,
  },
  BioID: {
    type: Number,
    required: true,
  },
  Prefix: {
    type: String,
    required: false,
    default: "",
  },
  FirstName: {
    type: String,
    required: true,
  },
  MiddleName: {
    type: String,
    required: false,
    default: "",
  },
  MI: {
    type: String,
    required: false,
    default: "",
  },
  LastName: {
    type: String,
    required: true,
  },
  EmployeeType: {
    type: String,
    required: true,
  },
  AssignedOutlet: {
    type: String,
    required: true,
  },
  Department: {
    type: String,
    required: true,
  },
  JobTitle: {
    type: String,
    required: true,
  },
  DateEmployed: {
    type: String,
    required: true,
  },
  DateLeaved: {
    type: String,
    required: false,
    default: "",
  },
  RegDate: {
    type: String,
    required: false,
    default: "",
  },
  DateProbationary: {
    type: String,
    required: true,
  },
  EmpStatus: {
    type: String,
    required: true,
  },
  Notes: {
    type: String,
    required: false,
    default: "",
  },
  TINnumber: {
    type: String,
    required: true,
  },
  SSSnumber: {
    type: String,
    required: true,
  },
  PHnumber: {
    type: String,
    required: true,
  },
  PInumber: {
    type: String,
    required: true,
  },
  ATMnumber: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("GenInfo", genInfoSchema);
