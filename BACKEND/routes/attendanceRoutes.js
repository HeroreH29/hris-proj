const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(attendanceController.getAttendanceData)
  .post(attendanceController.createAttendance)
  .patch(attendanceController.updateAttendance);
//   .delete(attendanceController.deleteAnnouncement);

module.exports = router;
