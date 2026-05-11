const Group = require("../models/group.model");

const User = require("../models/user.model");

const Expense = require("../models/expense.model");

const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    const group = await Group.create({
      name,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
    })
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addMemberToGroup = async (req, res) => {
  try {
    const { groupId, email } =
      req.body;

    const group =
      await Group.findById(
        groupId
      );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyMember =
      group.members.includes(
        user._id
      );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists in group",
      });
    }

    group.members.push(user._id);

    await group.save();

    const updatedGroup =
      await Group.findById(
        groupId
      )
        .populate(
          "createdBy",
          "name email"
        )
        .populate(
          "members",
          "name email"
        );

    res.status(200).json({
      success: true,
      message:
        "Member added successfully",
      data: updatedGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const simplifyBalances = (
  balances
) => {
  const creditors = [];

  const debtors = [];

  const settlements = [];

  Object.entries(
    balances
  ).forEach(
    ([name, amount]) => {
      if (amount > 0) {
        creditors.push({
          name,
          amount,
        });
      }

      if (amount < 0) {
        debtors.push({
          name,
          amount:
            Math.abs(amount),
        });
      }
    }
  );

  let i = 0;

  let j = 0;

  while (
    i < debtors.length &&
    j < creditors.length
  ) {
    const debtor =
      debtors[i];

    const creditor =
      creditors[j];

    const settledAmount =
      Math.min(
        debtor.amount,
        creditor.amount
      );

    settlements.push({
      from: debtor.name,
      to: creditor.name,
      amount:
        Number(
          settledAmount.toFixed(
            2
          )
        ),
    });

    debtor.amount -=
      settledAmount;

    creditor.amount -=
      settledAmount;

    if (
      debtor.amount < 1
    ) {
      i++;
    }

    if (
      creditor.amount < 1
    ) {
      j++;
    }
  }

  return settlements;
};

const getGroupBalances =
  async (req, res) => {
    try {
      const { groupId } =
        req.params;

      const expenses =
        await Expense.find({
          group: groupId,
        })
          .populate(
            "paidBy",
            "name"
          )
          .populate(
            "splitBetween.user",
            "name"
          );

      const balances = {};

      expenses.forEach(
        (expense) => {
          const payerName =
            expense.paidBy.name;

          if (
            !balances[
              payerName
            ]
          ) {
            balances[
              payerName
            ] = 0;
          }

          balances[
            payerName
          ] += expense.amount;

          expense.splitBetween.forEach(
            (split) => {
              const memberName =
                split.user.name;

              if (
                !balances[
                  memberName
                ]
              ) {
                balances[
                  memberName
                ] = 0;
              }

              balances[
                memberName
              ] -= split.amount;
            }
          );
        }
      );

      const settlements =
        simplifyBalances(
          balances
        );

      res.status(200).json({
        success: true,
        balances,
        settlements,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

const getGroupDetails =
  async (req, res) => {
    try {
      const { groupId } =
        req.params;

      const group =
        await Group.findById(
          groupId
        )
          .populate(
            "createdBy",
            "name email"
          )
          .populate(
            "members",
            "name email"
          );

      if (!group) {
        return res.status(404).json({
          success: false,
          message: "Group not found",
        });
      }

      const expenses =
        await Expense.find({
          group: groupId,
        })
          .populate(
            "paidBy",
            "name email"
          )
          .populate(
            "splitBetween.user",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        data: {
          group,
          expenses,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  createGroup,
  getUserGroups,
  addMemberToGroup,
  getGroupBalances,
  getGroupDetails,
};