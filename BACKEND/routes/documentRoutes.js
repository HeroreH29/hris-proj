const express = require("express");
const router = express.Router();
const documentsController = require("../controllers/documentsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/").get(documentsController.getDocuments).post().patch().delete();

module.exports = router;
