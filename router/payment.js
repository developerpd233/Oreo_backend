const express = require("express");

const router = express.Router();

const paymentController = require("../controller/payment");

router.post("/payment", paymentController.payment);

module.exports = router;
