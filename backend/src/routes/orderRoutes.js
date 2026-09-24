const express = require("express");

const {
  createCodOrder,
  createManualPaymentOrder,
  getOrderById,
  verifyManualPayment,
} = require("../controllers/orderController");

const router = express.Router();

/*
 * COD
 */
router.post("/cod", createCodOrder);

/*
 * bKash / Nagad / Rocket Personal
 */
router.post("/manual-payment", createManualPaymentOrder);

/*
 * Manual verification
 */
router.patch("/:id/payment-verification", verifyManualPayment);

/*
 * Get order
 */
router.get("/:id", getOrderById);

module.exports = router;
