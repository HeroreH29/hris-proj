const express = require("express");
const router = express.Router();
const employeeRecordsController = require("../controllers/employeeRecordsController");
const verifyJWT = require("../middleware/verifyJWT");

//router.use(verifyJWT);

router
  .route("/")
  .get(employeeRecordsController.getEmployeeRecords)
  .post()
  .patch()
  .delete();

module.exports = router;
