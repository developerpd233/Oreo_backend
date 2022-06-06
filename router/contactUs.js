const express = require("express");

const router = express.Router();

const contactUsController = require("../controller/contactUs");

router.post("/contact", contactUsController.contact);

router.post("/get-in-touch", contactUsController.getInTouch);

module.exports = router;
