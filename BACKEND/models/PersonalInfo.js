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
  Address: {
    type: String,
    required: true,
  },
  ZipCode: {
    type: Number,
    required: true,
  },
  Email: {
    type: String,
    required: false,
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
    required: false,
    default: "",
  },
  Mobile: {
    type: String,
    required: false,
    default: "",
  },
  Spouse: {
    type: String,
    required: false,
    default: "",
  },
  FatherName: {
    type: String,
    required: false,
    default: "",
  },
  Foccupation: {
    type: String,
    required: false,
    default: "",
  },
  MotherName: {
    type: String,
    required: false,
    default: "",
  },
  Moccupation: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("PersonalInfo", personalInfoSchema);
