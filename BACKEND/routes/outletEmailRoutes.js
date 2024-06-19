const express = require("express");
const router = express.Router();
const outletEmailsController = require("../controllers/outletEmailsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(outletEmailsController.getAllOutletEmails)
  .post()
  .patch()
  .delete();

module.exports = router;
