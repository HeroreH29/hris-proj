const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trainingHistorySchema = new Schema({
  EmployeeID: {
    type: Object,
    required: true,
  },
  TrainingCourse: {
    type: String,
    required: true,
  },
  TrainingDate: {
    type: String,
    required: true,
  },
  Remarks: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("TrainingHistory", trainingHistorySchema);
