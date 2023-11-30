const express = require("express");
const router = express.Router();
const personalInfoController = require("../controllers/personalInfoController");

router
  .route("/")
  .get(personalInfoController.getAllPersonalInfo)
  .post(personalInfoController.createPersonalInfo)
  .patch(personalInfoController.updatePersonalInfo)
  .delete();

module.exports = router;
