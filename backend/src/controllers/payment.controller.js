const crypto = require("crypto");

const Payment = require("../models/payment.model");

const User = require("../models/user.model");

const razorpay = require("../config/razorpay");

const createSettlement =
  async (req, res) => {
    try {
      const {
        groupId,
        receiverId,
        amount,
      } = req.body;

      const receiver =
        await User.findById(
          receiverId
        );

      if (!receiver) {
        return res.status(404).json({
          success: false,
          message:
            "Receiver not found",
        });
      }

      // EXISTING CUSTOMER CHECK
      let customerId =
        req.user
          .razorpayCustomerId;

      // CREATE CUSTOMER IF NOT EXISTS
      if (!customerId) {
        const customer =
          await razorpay.customers.create(
            {
              name:
                req.user.name,

              email:
                req.user.email,

              contact:
                req.user.phone ||
                "9876543210",
            }
          );

        customerId =
          customer.id;

        await User.findByIdAndUpdate(
          req.user._id,
          {
            razorpayCustomerId:
              customerId,
          }
        );
      }

      const razorpayOrder =
        await razorpay.orders.create(
          {
            amount:
              amount * 100,

            currency: "INR",

            receipt: `receipt_${Date.now()}`,
          }
        );

      const payment =
        await Payment.create({
          group: groupId,

          payer: req.user._id,

          receiver: receiverId,

          amount,

          status: "pending",

          razorpayOrderId:
            razorpayOrder.id,
        });

      const populatedPayment =
        await Payment.findById(
          payment._id
        )
          .populate(
            "payer",
            "name email upiId"
          )
          .populate(
            "receiver",
            "name email upiId"
          )
          .populate(
            "group",
            "name"
          );

      const paymentPageUrl =
        `https://payment-page-weld.vercel.app/?order_id=${razorpayOrder.id}&amount=${amount * 100}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&contact=${encodeURIComponent(req.user.phone || "9876543210")}&customer_id=${customerId}`;

      res.status(201).json({
        success: true,

        message:
          "Order created successfully",

        data: {
          payment:
            populatedPayment,

          paymentLink:
            paymentPageUrl,

          orderId:
            razorpayOrder.id,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

const getMyPayments =
  async (req, res) => {
    try {
      const payments =
        await Payment.find({
          $or: [
            {
              payer:
                req.user._id,
            },

            {
              receiver:
                req.user._id,
            },
          ],
        })
          .populate(
            "payer",
            "name email upiId"
          )
          .populate(
            "receiver",
            "name email upiId"
          )
          .populate(
            "group",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,

        count:
          payments.length,

        data: payments,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

const getPaymentById =
  async (req, res) => {
    try {
      const payment =
        await Payment.findById(
          req.params.paymentId
        )
          .populate(
            "payer",
            "name email upiId"
          )
          .populate(
            "receiver",
            "name email upiId"
          )
          .populate(
            "group",
            "name"
          );

      if (!payment) {
        return res.status(404).json({
          success: false,

          message:
            "Payment not found",
        });
      }

      res.status(200).json({
        success: true,

        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

const razorpayWebhook =
  async (req, res) => {
    try {
      const webhookSignature =
        req.headers[
          "x-razorpay-signature"
        ];

      const generatedSignature =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_WEBHOOK_SECRET
          )
          .update(
            JSON.stringify(
              req.body
            )
          )
          .digest("hex");

      if (
        webhookSignature !==
        generatedSignature
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid webhook signature",
        });
      }

      const event =
        req.body.event;

      if (
        event ===
        "payment.captured"
      ) {
        const razorpayPaymentId =
          req.body.payload
            .payment.entity.id;

        const razorpayOrderId =
          req.body.payload
            .payment.entity.order_id;

        const payment =
          await Payment.findOne({
            razorpayOrderId:
              razorpayOrderId,
          });

        if (payment) {
          payment.status =
            "success";

          payment.razorpayPaymentId =
            razorpayPaymentId;

          await payment.save();
        }
      }

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        success: false,

        message:
          error.message,
      });
    }
  };

module.exports = {
  createSettlement,

  getMyPayments,

  getPaymentById,

  razorpayWebhook,
};