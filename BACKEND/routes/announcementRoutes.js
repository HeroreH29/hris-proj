const express = require("express");
const router = express.Router();
const announcementsController = require("../controllers/announcementsController");

router
  .route("/")
  .get(announcementsController.getAllAnnouncements)
  .post(announcementsController.createAnnouncement)
  .patch(announcementsController.updateAnnouncement)
  .delete(announcementsController.deleteAnnouncement);

module.exports = router;
