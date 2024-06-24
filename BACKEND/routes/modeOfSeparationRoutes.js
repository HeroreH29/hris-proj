const express = require("express");
const router = express.Router();
const modeOfSeparationsController = require("../controllers/modeOfSeparationsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(modeOfSeparationsController.getAllModeOfSeparations)
  .post()
  .patch()
  .delete();

module.exports = router;
