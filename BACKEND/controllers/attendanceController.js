const Attendance = require("../models/Attendance");

// @desc Get attendance data
// @route GET /attendances
// @access Private
const getAttendanceData = async (req, res) => {
  const attendancedata = await Attendance.find().lean();
  if (!attendancedata?.length) {
    return res.status(400).json({ message: "No attendance data found" });
  }

  res.json(attendancedata);
};

// @desc Create attendance
// @route POST /attendances
// @access Private
const createAttendance = async (req, res) => {
  const data = req.body;

  // Check if other properties of the request body has values
  const othersHasValues = Object.values(data).every((value) => value);

  // Some values are missing
  if (!othersHasValues) {
    return res.status(400).json({ message: "Some fields are missing values" });
  }

  // Create and store new announcement
  const attendance = await Attendance.create(data);

  if (attendance) {
    return res.status(201).json({ message: `Attendance data uploaded` });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid attendance data received" });
  }
};

module.exports = { getAttendanceData, createAttendance };
