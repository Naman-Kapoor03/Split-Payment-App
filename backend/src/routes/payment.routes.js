const express = require("express");

const router = express.Router();

const {
  createSettlement,
  getMyPayments,
  getPaymentById,
  razorpayWebhook,
} = require("../controllers/payment.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

router.post(
  "/",
  protect,
  createSettlement
);

router.get(
  "/",
  protect,
  getMyPayments
);

router.get(
  "/:paymentId",
  protect,
  getPaymentById
);

router.post(
  "/webhook",
  razorpayWebhook
);
  
module.exports = router;