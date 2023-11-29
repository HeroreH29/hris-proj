const express = require("express");
const router = express.Router();
const genInfoController = require("../controllers/genInfosController");

router
  .route("/")
  .get(genInfoController.getAllGenInfo)
  .post(genInfoController.createGenInfo)
  .patch(genInfoController.updateGenInfo)
  .delete();

module.exports = router;
