const mongoose = require("mongoose");
const { format } = require("date-fns");

const attendanceSchema = new mongoose.Schema({
  attlogName: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
  createdAt: {
    type: String,
    default: format(new Date(), "Ppppp"),
  },
  updatedAt: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
