const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Entertainment",
        "Other",
      ],
      default: "Other",
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    splitBetween: [
      {
        user: {
          type:
            mongoose.Schema.Types
              .ObjectId,
          ref: "User",
        },

        amount: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model(
  "Expense",
  expenseSchema
);

module.exports = Expense;