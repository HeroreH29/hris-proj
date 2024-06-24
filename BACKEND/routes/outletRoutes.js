const express = require("express");
const router = express.Router();
const outletsControllers = require("../controllers/outletsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/").get(outletsControllers.getAllOutlets).post().patch().delete();

module.exports = router;
