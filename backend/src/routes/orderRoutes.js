const express = require("express");

const {
  createCodOrder,
  getOrderById,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/cod", createCodOrder);

router.get("/:id", getOrderById);

module.exports = router;
