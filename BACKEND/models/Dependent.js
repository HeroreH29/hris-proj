const mongoose = require("mongoose");

const dependentSchema = new mongoose.Schema({
  EmployeeID: {
    type: String,
    required: true,
  },
  Names: {
    type: String,
    required: true,
  },
  Dependent: {
    type: String,
    required: true,
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
