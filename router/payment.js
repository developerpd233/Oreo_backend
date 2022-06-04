const express = require("express");

const router = express.Router();

const paymentController = require("../controller/paymentFlow");
const paypalIntegrationController = require("../controller/paypalIntegration");

router.post("/payment", paymentController.payment);

router.post("/invoice", paymentController.getFormData);

router.get("/all-invoices", paymentController.getInvoices);

router.post("/paypal-payment", paypalIntegrationController.paypalIntegration);

router.get("/success", paypalIntegrationController.success);

router.patch("/edit-invoice/:invoiceID", paymentController.editInvoice);

router.delete("/invoice/:invoiceID", paymentController.deleteInvoice);

module.exports = router;
