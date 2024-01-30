const express = require("express");
const router = express.Router();
const inactiveEmpsController = require("../controllers/inactiveEmpsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(inactiveEmpsController.getAllInactiveEmps)
  .post(inactiveEmpsController.createInactiveEmp)
  .patch(inactiveEmpsController.updateInactiveEmp)
  .delete(inactiveEmpsController.deleteInactiveEmp);

module.exports = router;
