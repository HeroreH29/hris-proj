const express = require("express");
const router = express.Router();
const userAccessesController = require("../controllers/userAccessesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(userAccessesController.getAllUserAccess)
  .post()
  .patch(userAccessesController.updateUserAccess)
  .delete();

module.exports = router;
