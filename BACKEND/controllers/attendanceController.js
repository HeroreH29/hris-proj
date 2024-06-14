const Attendance = require("../models/Attendance");
const { format } = require("date-fns");

// @desc Get attendance data
// @route GET /attendances
// @access Private
const getAttendanceData = async (req, res) => {
  const attendancedata = await Attendance.find().lean();
  if (!attendancedata?.length) {
    res
      .status(404)
      .json({ message: "No attendance data found. Upload one now!" });
  }

  attendancedata[0].data = atob(attendancedata[0].data.toString("base64"));

  res.json(attendancedata);
};

// @desc Create attendance
// @route POST /attendances
// @access Private
const createAttendance = async (req, res) => {
  const { data, ...others } = req.body;

  // Check if other properties of the request body has values
  const othersHasValues = Object.values(req.body).every((value) => value);

  // Some values are missing
  if (!othersHasValues) {
    return res.status(400).json({ message: "Some fields are missing values" });
  }

  // Check if attendance data already exist in the database. Prevent upload if it is.
  const isAttlogExist = await Attendance.findOne({ data: data });
  if (isAttlogExist)
    return res
      .status(409)
      .json({ message: "Attlog data already exist in the system!" });

  // Create and store new announcement
  const attendance = await Attendance.create(req.body);

  if (attendance) {
    return res.status(201).json({ message: `Attendance data uploaded` });
  } else {
    return res
      .status(400)
      .json({ message: "Invalid attendance data received" });
  }
};

// @desc Update attendance
// @route PATCH /attendances
// @access Private
const updateAttendance = async (req, res) => {
  const { id, attlogName, data } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ messsage: "Document id is not provided" });
  }

  // Confirm attendance exist to update
  const attendance = await Attendance.findById(id).exec();

  if (!attendance) {
    return res.status(400).json({ messsage: "Attendance data not found" });
  }

  attendance.attlogName = attlogName;
  attendance.data = data;
  attendance.updatedAt = format(new Date(), "Ppppp");

  const updatedAttendance = await attendance.save();

  res.json(`${updatedAttendance.attlogName} has been updated`);
};

module.exports = { getAttendanceData, createAttendance, updateAttendance };
