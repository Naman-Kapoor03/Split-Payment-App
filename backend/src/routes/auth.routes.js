const express = require("express");

const router =
  express.Router();

const {
  signup,
  login,
  updateUpiId,
} = require(
  "../controllers/auth.controller"
);

const {
  protect,
} = require(
  "../middleware/auth.middleware"
);

router.post(
  "/signup",
  signup
);

router.post(
  "/login",
  login
);

router.put(
  "/upi",
  protect,
  updateUpiId
);

router.get(
  "/me",
  protect,
  (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

module.exports = router;