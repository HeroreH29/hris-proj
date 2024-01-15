const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leavesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(leaveController.getAllLeaves)
  .post(leaveController.createLeave)
  .patch(leaveController.updateLeave)
  .delete(leaveController.deleteLeave);

module.exports = router;
