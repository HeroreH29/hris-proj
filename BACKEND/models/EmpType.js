const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const empTypeSchema = new Schema({
  Code: Number,
  empType: String,
  PayrollProcess: String,
});

module.exports = mongoose.model("EmpType", empTypeSchema);
