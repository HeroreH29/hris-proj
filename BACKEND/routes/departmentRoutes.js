const express = require("express");
const router = express.Router();
const departmentsController = require("../controllers/deparmentsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(departmentsController.getAllDepartments)
  .post()
  .patch()
  .delete();

module.exports = router;
