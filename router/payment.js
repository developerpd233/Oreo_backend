const express = require("express");

const router = express.Router();

const paymentController = require("../controller/paymentFlow");
const paypalIntegrationController = require("../controller/paypalIntegration");

// router.post("/payment", paymentController.payment);

router.post("/invoice", paymentController.getFormData);

router.get("/all-invoices", paymentController.getInvoices);

router.get("/invoice", paymentController.getInvoice);

router.patch("/edit-invoice/:invoiceID", paymentController.editInvoice);

router.delete("/invoice/:invoiceID", paymentController.deleteInvoice);

router.post("/create-payment", paypalIntegrationController.paypalIntegration);

router.post("/execute-payment", paypalIntegrationController.success);

module.exports = router;
