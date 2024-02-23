const express = require("express");
const router = express.Router();
const ipAddressController = require("../controllers/ipAddressController");

router.route("/").get(ipAddressController.getLocalIpAddress);

module.exports = router;
