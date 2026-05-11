const Expense = require("../models/expense.model");

const Group = require("../models/group.model");

const addExpense = async (
  req,
  res
) => {
  try {
    const {
      title,
      amount,
      groupId,
      category,
    } = req.body;

    const group =
      await Group.findById(
        groupId
      ).populate("members");

    if (!group) {
      return res.status(404).json({
        success: false,
        message:
          "Group not found",
      });
    }

    const splitAmount =
      amount /
      group.members.length;

    const splitBetween =
      group.members.map(
        (member) => ({
          user: member._id,
          amount: splitAmount,
        })
      );

    const expense =
      await Expense.create({
        title,
        amount,
        category,
        group: groupId,
        paidBy: req.user._id,
        splitBetween,
      });

    res.status(201).json({
      success: true,
      message:
        "Expense added successfully",
      data: expense,
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
  addExpense,
};