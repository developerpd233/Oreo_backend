const express = require("express");

const router = express.Router();

const paymentController = require("../controller/paymentFlow");

router.post("/payment", paymentController.payment);

router.post("/form-data", paymentController.getFormData);

router.get("/all-invoices", paymentController.getInvoices);

module.exports = router;
