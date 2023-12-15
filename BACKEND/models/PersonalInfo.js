const mongoose = require("mongoose");

const personalInfoSchema = new mongoose.Schema({
  EmployeeID: {
    type: String,
    required: true,
  },
  Birthday: {
    type: String,
    required: true,
  },
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
    default: "",
  },
  Gender: {
    type: String,
    required: true,
  },
  CivilStatus: {
    type: String,
    required: true,
  },
  Height: {
    type: Number,
    required: true,
  },
  Weight: {
    type: Number,
    required: true,
  },
  Phone: {
    type: String,
    default: "",
  },
  Mobile: {
    type: String,
    default: "",
  },
  Spouse: {
    type: String,
    default: "",
  },
  FatherName: {
    type: String,
    default: "",
  },
  Foccupation: {
    type: String,
    default: "",
  },
  MotherName: {
    type: String,
    default: "",
  },
  Moccupation: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("PersonalInfo", personalInfoSchema);
