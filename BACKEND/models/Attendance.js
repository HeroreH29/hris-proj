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
  uploadedAt: {
    type: String,
    default: new Date(),
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
