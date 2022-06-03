const express = require("express");

const router = express.Router();

const paymentController = require("../controller/payment");

router.post("/payment", paymentController.payment);

router.post("/all-invoices", paymentController.getInvoices);

module.exports = router;
