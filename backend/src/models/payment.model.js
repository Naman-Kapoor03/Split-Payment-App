const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "success",
        "failed",
        "cancelled",
      ],
      default: "pending",
    },

    razorpayOrderId: {
      type: String,
    },

    razorpayPaymentId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

module.exports = Payment;