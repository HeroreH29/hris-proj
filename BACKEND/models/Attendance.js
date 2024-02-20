const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    attlogName: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
