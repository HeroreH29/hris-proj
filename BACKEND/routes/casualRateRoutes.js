const express = require("express");
const router = express.Router();
const casualRatesController = require("../controllers/casualRatesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(casualRatesController.getAllCasualRates)
  .post()
  .patch(casualRatesController.updateCasualRate)
  .delete();

module.exports = router;
