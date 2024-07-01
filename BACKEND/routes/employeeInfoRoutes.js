const express = require("express");
const router = express.Router();
const employeeInfosController = require("../controllers/employeeInfosController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(employeeInfosController.getAllEmployeeInfos)
  .post(employeeInfosController.createEmployeeInfo)
  .patch(employeeInfosController.updateEmployeeInfo)
  .delete();

module.exports = router;
