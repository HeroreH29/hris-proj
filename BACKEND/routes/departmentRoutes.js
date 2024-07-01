const express = require("express");
const router = express.Router();
const departmentsController = require("../controllers/departmentsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(departmentsController.getAllDepartments)
  .post()
  .patch()
  .delete();

module.exports = router;
