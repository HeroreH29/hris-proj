const express = require("express");
const router = express.Router();
const dependentsController = require("../controllers/dependentsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(dependentsController.getAllDependents)
  .post(dependentsController.createDependent)
  .patch(dependentsController.updateDependent)
  .delete(dependentsController.deleteDependent);

module.exports = router;
