const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  Title: String,
});

module.exports = mongoose.model("Department", departmentSchema);
