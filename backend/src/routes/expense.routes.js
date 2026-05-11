const express = require("express");

const router = express.Router();

const {
  addExpense,
} = require("../controllers/expense.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

router.post("/", protect, addExpense);

module.exports = router;