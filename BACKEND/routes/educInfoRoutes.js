const express = require("express");
const router = express.Router();
const educInfosController = require("../controllers/educInfosController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(educInfosController.getAllEducInfos)
  .post(educInfosController.createEducInfo)
  .patch(educInfosController.updateEducInfo)
  .delete(educInfosController.deleteEducInfo);

module.exports = router;
