const mongoose = require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        default: "",
      },

      upiId: {
        type: String,
        default: "",
      },

      razorpayCustomerId: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

const User = mongoose.model(
  "User",
  userSchema
);

module.exports = User;