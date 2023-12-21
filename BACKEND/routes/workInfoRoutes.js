const express = require("express");
const router = express.Router();
const workInfosController = require("../controllers/workInfosController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(workInfosController.getAllWorkInfo)
  .post(workInfosController.createWorkInfo)
  .patch(workInfosController.updateWorkInfo)
  .delete(workInfosController.deleteWorkInfo);

module.exports = router;
