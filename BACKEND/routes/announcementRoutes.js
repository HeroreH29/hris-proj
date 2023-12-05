const express = require("express");
const router = express.Router();
const announcementsController = require("../controllers/announcementsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(announcementsController.getAllAnnouncements)
  .post(announcementsController.createAnnouncement)
  .patch(announcementsController.updateAnnouncement)
  .delete(announcementsController.deleteAnnouncement);

module.exports = router;
