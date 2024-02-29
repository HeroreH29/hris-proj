const mongoose = require("mongoose");

const personalInfoSchema = new mongoose.Schema({
  EmployeeID: {
    type: Object,
    required: true,
  },
  Birthday: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    default: "",
  },
  PresentAddress: {
    type: String,
    default: "",
  },
  PermanentAddress: {
    type: String,
    default: "",
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

/* personalInfoSchema.pre("updateOne", { document: true, query: false }, () => {
  console.log("Updating...");
}); */

module.exports = mongoose.model("PersonalInfo", personalInfoSchema);
