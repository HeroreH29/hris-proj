const Attendance = require("../models/Attendance");
const { format } = require("date-fns");

// Conversion function of base64 string to a usable file
const base64ToFile = (base64String, fileName) => {
  // Decode Base64 string
  const binaryString = atob(base64String.toString("base64"));

  // Convert binary string to ArrayBuffer
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  // Create Blob from ArrayBuffer
  const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });

  // Create File object from Blob
  const file = new File([blob], fileName);

  return file;
};

// @desc Get attendance data
// @route GET /attendances
// @access Private
const getAttendanceData = async (req, res) => {
  const attendancedata = await Attendance.find().lean();
  if (!attendancedata?.length) {
    return res.status(400).json({ message: "No attendance data found" });
  }

  const modifiedAttendanceData = {
    ...attendancedata,
    fileContents: base64ToFile(
      attendancedata[0].data,
      attendancedata[0].attlogName
    ),
  };

  res.json(modifiedAttendanceData);
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
