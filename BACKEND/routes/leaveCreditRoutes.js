const express = require("express");
const router = express.Router();
const leaveCreditsController = require("../controllers/leaveCreditsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(leaveCreditsController.getAllLeaveCredits)
  .post(leaveCreditsController.createLeaveCredit)
  .patch(leaveCreditsController.updateLeaveCredit)
  .delete(leaveCreditsController.deleteLeaveCredit);

module.exports = router;
