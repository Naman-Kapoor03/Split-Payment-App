const express = require("express");

const router =
  express.Router();

const {
  createGroup,
  getUserGroups,
  addMemberToGroup,
  getGroupBalances,
  getGroupDetails,
} = require(
  "../controllers/group.controller"
);

const {
  protect,
} = require(
  "../middleware/auth.middleware"
);

router.post(
  "/",
  protect,
  createGroup
);

router.get(
  "/",
  protect,
  getUserGroups
);

router.post(
  "/add-member",
  protect,
  addMemberToGroup
);

router.get(
  "/:groupId/balances",
  protect,
  getGroupBalances
);

router.get(
  "/:groupId/details",
  protect,
  getGroupDetails
);

module.exports = router;