const mongoose = require("mongoose");

const dependentSchema = new mongoose.Schema({
  EmployeeID: {
    type: Object,
    required: true,
  },
  Names: {
    type: String,
    required: true,
  },
  Dependent: {
    type: String,
    default: "",
  },
  Birthday: {
    type: String,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  Relationship: {
    type: String,
    required: true,
  },
  Covered: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Dependent", dependentSchema);
