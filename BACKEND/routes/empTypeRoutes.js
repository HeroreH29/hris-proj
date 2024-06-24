const express = require("express");
const router = express.Router();
const empTypesController = require("../controllers/empTypesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(empTypesController.getAllEmpTypes)
  .post()
  .patch()
  .delete();

module.exports = router;
