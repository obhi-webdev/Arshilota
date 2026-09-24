const express = require("express");

const {
  initiatePayment,
  paymentSuccess,
  paymentIpn,
  paymentFail,
  paymentCancel,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/initiate", initiatePayment);

router.post("/success", paymentSuccess);

router.post("/ipn", paymentIpn);

router.post("/fail", paymentFail);

router.post("/cancel", paymentCancel);

module.exports = router;
