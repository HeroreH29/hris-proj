const express = require("express");
const router = express.Router();
const emailSenderController = require("../controllers/emailSenderController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get()
  .post(emailSenderController.sendLeaveThruEmail)
  .patch()
  .delete();

module.exports = router;
