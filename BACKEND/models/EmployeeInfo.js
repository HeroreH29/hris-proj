const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// SUB SCHEMAS
const genInfoSchema = new Schema({
  Prefix: {
    type: String,
    required: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  MiddleName: String,
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
  EmploymentDate: {
    type: Date,
    required: true,
  },
  ProbationaryDate: {
    type: Date,
    required: true,
  },
  RegularizationDate: {
    type: Date,
    required: true,
  },
  ResignationDate: Date,
  Reason: String,
  Contractual: Boolean,
  ContractEndDate: Date,
  EmpStatus: {
    type: String,
    enum: ["Y", "N"],
    required: true,
  },
  Notes: String,
  TIN: {
    type: String,
    required: true,
  },
  SSS: {
    type: String,
    required: true,
  },
  PhilHealth: {
    type: String,
    required: true,
  },
  PagIBIG: {
    type: String,
    required: true,
  },
  ATM: String,
});

const personalInfoSchema = new Schema({
  Birthday: {
    type: Date,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  CivilStatus: {
    type: String,
    required: true,
  },
  Height: Number,
  Weight: Number,
  Phone: String,
  Mobile: String,
  Spouse: String,
  FatherName: String,
  FatherOccupation: String,
  MotherName: String,
  MotherOccupation: String,
  PresentAddress: {
    type: String,
    required: true,
  },
  PermanentAddress: {
    type: String,
    required: true,
  },
  ZipCode: {
    type: Number,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
});

// MAIN SCHEMA
const employeeInfoSchema = new Schema({
  EmployeeID: {
    type: Object,
    required: true,
  },
  GenInfo: { type: genInfoSchema, default: {} },
  PersonalInfo: { type: personalInfoSchema, default: {} },
});

module.exports = mongoose.model("EmployeeInfo", employeeInfoSchema);
