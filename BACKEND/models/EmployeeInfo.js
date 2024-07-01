const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeInfoSchema = new Schema({
  EmployeeID: {
    type: Object,
    required: true,
  },
  GenInfo: {},
});
