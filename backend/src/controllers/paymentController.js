const Order = require("../models/Order");

const PRODUCT = require("../config/product");

const {
  initiateSslPayment,
  validateSslPayment,
} = require("../services/sslcommerzService");

const {
  generateOrderNumber,
  generateTransactionId,
} = require("../utils/generateId");

const customerIsValid = (customer) => {
  return Boolean(
    customer &&
    customer.name &&
    customer.phone &&
    customer.email &&
    customer.district &&
    customer.postcode &&
    customer.address,
  );
};

const safeText = (value, maxLength = 50) => {
  return String(value || "")
    .trim()
    .slice(0, maxLength);
};

const initiatePayment = async (req, res) => {
  try {
    const { customer, quantity } = req.body;

    if (!customerIsValid(customer)) {
      return res.status(400).json({
        success: false,

        message: "সব Delivery Information পূরণ করুন।",
      });
    }

    if (!process.env.SSLC_STORE_ID || !process.env.SSLC_STORE_PASSWORD) {
      return res.status(500).json({
        success: false,

        message: "Payment gateway credentials configure করা হয়নি।",
      });
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity.",
      });
    }

    const subtotal = PRODUCT.price * qty;

    const deliveryCharge = PRODUCT.deliveryCharge;

    const total = subtotal + deliveryCharge;

    const transactionId = generateTransactionId();

    const order = await Order.create({
      orderNumber: generateOrderNumber(),

      customer: {
        name: customer.name.trim(),

        phone: customer.phone.trim(),

        email: customer.email.trim().toLowerCase(),

        district: customer.district.trim(),

        postcode: customer.postcode.trim(),

        address: customer.address.trim(),
      },

      product: {
        productId: PRODUCT.id,

        name: PRODUCT.name,

        unitPrice: PRODUCT.price,

        quantity: qty,
      },

      subtotal,

      deliveryCharge,

      total,

      paymentMethod: "SSLCOMMERZ",

      paymentStatus: "pending",

      orderStatus: "pending",

      transactionId,
    });

    const backendUrl = process.env.BACKEND_URL;

    const payload = {
      store_id: process.env.SSLC_STORE_ID,

      store_passwd: process.env.SSLC_STORE_PASSWORD,

      total_amount: total.toFixed(2),

      currency: "BDT",

      tran_id: transactionId,

      success_url: `${backendUrl}/api/payments/success`,

      fail_url: `${backendUrl}/api/payments/fail`,

      cancel_url: `${backendUrl}/api/payments/cancel`,

      ipn_url: `${backendUrl}/api/payments/ipn`,

      product_name: PRODUCT.name,

      product_category: PRODUCT.category,

      product_profile: "physical-goods",

      cus_name: safeText(customer.name),

      cus_email: customer.email.trim(),

      cus_add1: safeText(customer.address),

      cus_city: safeText(customer.district),

      cus_state: safeText(customer.district),

      cus_postcode: safeText(customer.postcode, 20),

      cus_country: "Bangladesh",

      cus_phone: safeText(customer.phone, 20),

      shipping_method: "YES",

      num_of_item: qty,

      ship_name: safeText(customer.name),

      ship_add1: safeText(customer.address),

      ship_area: safeText(customer.district),

      ship_city: safeText(customer.district),

      ship_state: safeText(customer.district),

      ship_postcode: safeText(customer.postcode, 20),

      ship_country: "Bangladesh",

      value_a: order._id.toString(),

      value_b: order.orderNumber,
    };

    const paymentResponse = await initiateSslPayment(payload);

    if (
      paymentResponse?.status !== "SUCCESS" ||
      !paymentResponse?.GatewayPageURL
    ) {
      order.paymentStatus = "failed";

      order.gatewayStatus = paymentResponse?.status || "FAILED";

      await order.save();

      return res.status(502).json({
        success: false,

        message:
          paymentResponse?.failedreason ||
          "Payment gateway session তৈরি করা যায়নি।",
      });
    }

    order.sessionKey = paymentResponse.sessionkey || null;

    order.gatewayStatus = paymentResponse.status;

    await order.save();

    return res.json({
      success: true,

      orderId: order._id,

      transactionId,

      gatewayUrl: paymentResponse.GatewayPageURL,
    });
  } catch (error) {
    console.error(
      "Payment initiation error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,

      message: "Payment initiate করা যায়নি।",
    });
  }
};

const verifyPayment = async ({ validationId, transactionId }) => {
  if (!validationId || !transactionId) {
    throw new Error("Missing payment verification data.");
  }

  const order = await Order.findOne({
    transactionId,
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.paymentStatus === "paid") {
    return order;
  }

  const validation = await validateSslPayment(validationId);

  const statusValid = ["VALID", "VALIDATED"].includes(validation.status);

  const transactionValid = validation.tran_id === order.transactionId;

  const validationAmount = Number(validation.amount);

  const amountValid =
    Number.isFinite(validationAmount) &&
    Math.abs(validationAmount - order.total) < 0.01;

  if (!statusValid || !transactionValid || !amountValid) {
    throw new Error("Payment verification failed.");
  }

  order.paymentStatus = "paid";

  order.orderStatus = "confirmed";

  order.validationId = validationId;

  order.bankTransactionId = validation.bank_tran_id || null;

  order.gatewayStatus = validation.status;

  order.cardType = validation.card_type || null;

  order.paymentValidatedAt = new Date();

  await order.save();

  return order;
};

const paymentSuccess = async (req, res) => {
  try {
    const order = await verifyPayment({
      validationId: req.body.val_id,

      transactionId: req.body.tran_id,
    });

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment/success?orderId=${order._id}`,
    );
  } catch (error) {
    console.error("Payment validation error:", error.message);

    return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
  }
};

const paymentIpn = async (req, res) => {
  try {
    const status = req.body.status;

    const transactionId = req.body.tran_id;

    if (status === "VALID" || status === "VALIDATED") {
      await verifyPayment({
        validationId: req.body.val_id,

        transactionId,
      });

      return res.status(200).send("IPN OK");
    }

    if (transactionId) {
      if (status === "CANCELLED") {
        await Order.findOneAndUpdate(
          { transactionId },

          {
            paymentStatus: "cancelled",

            gatewayStatus: status,
          },
        );
      }

      if (["FAILED", "EXPIRED", "UNATTEMPTED"].includes(status)) {
        await Order.findOneAndUpdate(
          { transactionId },

          {
            paymentStatus: "failed",

            gatewayStatus: status,
          },
        );
      }
    }

    return res.status(200).send("IPN received");
  } catch (error) {
    console.error("IPN error:", error.message);

    return res.status(400).send("IPN verification failed");
  }
};

const paymentFail = async (req, res) => {
  try {
    if (req.body.tran_id) {
      await Order.findOneAndUpdate(
        {
          transactionId: req.body.tran_id,
        },

        {
          paymentStatus: "failed",

          gatewayStatus: req.body.status || "FAILED",
        },
      );
    }
  } catch (error) {
    console.error(error);
  }

  return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
};

const paymentCancel = async (req, res) => {
  try {
    if (req.body.tran_id) {
      await Order.findOneAndUpdate(
        {
          transactionId: req.body.tran_id,
        },

        {
          paymentStatus: "cancelled",

          gatewayStatus: "CANCELLED",
        },
      );
    }
  } catch (error) {
    console.error(error);
  }

  return res.redirect(`${process.env.FRONTEND_URL}/payment/cancelled`);
};

module.exports = {
  initiatePayment,
  paymentSuccess,
  paymentIpn,
  paymentFail,
  paymentCancel,
};
