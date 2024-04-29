const express = require("express");
const router = express.Router();
const trainingHistoriesController = require("../controllers/trainingHistoriesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(trainingHistoriesController.getAllTrainingHistories)
  .post(trainingHistoriesController.createTrainingHistory)
  .patch(trainingHistoriesController.updateTrainingHistory)
  .delete(trainingHistoriesController.deleteTrainingHistory);

module.exports = router;
