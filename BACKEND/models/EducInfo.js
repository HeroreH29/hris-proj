const mongoose = require("mongoose");

const educInfoSchema = new mongoose.Schema({
  Institution_Name: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  Level: {
    type: String,
    required: true,
  },
  Degree: {
    type: String,
    default: "",
  },
  yrStart: {
    type: Number,
    required: true,
  },
  yrGraduated: {
    type: Number,
    required: true,
  },
  Field_of_Study: {
    type: String,
    default: "",
  },
  Major: {
    type: String,
    default: "",
  },
  EmployeeID: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("EducInfo", educInfoSchema);
