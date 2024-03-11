const express = require("express");
const router = express.Router();
const celebrantsController = require("../controllers/celebrantsController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router.route("/").get(celebrantsController.getAllCelebrants);

module.exports = router;
