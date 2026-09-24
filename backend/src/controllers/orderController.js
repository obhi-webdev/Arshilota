const Order = require("../models/Order");

const PRODUCT = require("../config/product");

const { generateOrderNumber } = require("../utils/generateId");

const PERSONAL_PAYMENT_METHODS = [
  "BKASH_PERSONAL",
  "NAGAD_PERSONAL",
  "ROCKET_PERSONAL",
];

const isCustomerValid = (customer) => {
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

const getQuantity = (quantity) => {
  const qty = Number(quantity);

  if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
    return null;
  }

  return qty;
};

const calculateOrder = (qty) => {
  const subtotal = PRODUCT.price * qty;

  const deliveryCharge = PRODUCT.deliveryCharge;

  const total = subtotal + deliveryCharge;

  return {
    subtotal,
    deliveryCharge,
    total,
  };
};

const cleanCustomer = (customer) => {
  return {
    name: customer.name.trim(),

    phone: customer.phone.trim(),

    email: customer.email.trim().toLowerCase(),

    district: customer.district.trim(),

    postcode: customer.postcode.trim(),

    address: customer.address.trim(),
  };
};

/*
|--------------------------------------------------------------------------
| Cash on Delivery
|--------------------------------------------------------------------------
*/

const createCodOrder = async (req, res) => {
  try {
    const { customer, quantity } = req.body;

    if (!isCustomerValid(customer)) {
      return res.status(400).json({
        success: false,
        message: "সব Delivery Information পূরণ করুন।",
      });
    }

    const qty = getQuantity(quantity);

    if (!qty) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity.",
      });
    }

    const { subtotal, deliveryCharge, total } = calculateOrder(qty);

    const order = await Order.create({
      orderNumber: generateOrderNumber(),

      customer: cleanCustomer(customer),

      product: {
        productId: PRODUCT.id,

        name: PRODUCT.name,

        unitPrice: PRODUCT.price,

        quantity: qty,
      },

      subtotal,

      deliveryCharge,

      total,

      paymentMethod: "COD",

      paymentStatus: "unpaid",

      orderStatus: "confirmed",
    });

    return res.status(201).json({
      success: true,

      message: "Cash on Delivery order successfully created.",

      order,
    });
  } catch (error) {
    console.error("COD order error:", error);

    return res.status(500).json({
      success: false,

      message: "Order তৈরি করা যায়নি।",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Personal Wallet Payment
|--------------------------------------------------------------------------
*/

const createManualPaymentOrder = async (req, res) => {
  try {
    const { customer, quantity, paymentMethod, senderPhone, transactionId } =
      req.body;

    if (!isCustomerValid(customer)) {
      return res.status(400).json({
        success: false,

        message: "সব Delivery Information পূরণ করুন।",
      });
    }

    const qty = getQuantity(quantity);

    if (!qty) {
      return res.status(400).json({
        success: false,

        message: "Invalid quantity.",
      });
    }

    if (!PERSONAL_PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,

        message: "Invalid payment method.",
      });
    }

    if (!senderPhone || !transactionId) {
      return res.status(400).json({
        success: false,

        message: "Sender number এবং Transaction ID দিন।",
      });
    }

    const existingTransaction = await Order.findOne({
      "manualPayment.transactionId": transactionId.trim(),
    });

    if (existingTransaction) {
      return res.status(409).json({
        success: false,

        message: "এই Transaction ID আগে ব্যবহার করা হয়েছে।",
      });
    }

    const { subtotal, deliveryCharge, total } = calculateOrder(qty);

    const order = await Order.create({
      orderNumber: generateOrderNumber(),

      customer: cleanCustomer(customer),

      product: {
        productId: PRODUCT.id,

        name: PRODUCT.name,

        unitPrice: PRODUCT.price,

        quantity: qty,
      },

      subtotal,

      deliveryCharge,

      total,

      paymentMethod,

      paymentStatus: "verification_pending",

      orderStatus: "pending",

      manualPayment: {
        senderPhone: senderPhone.trim(),

        transactionId: transactionId.trim().toUpperCase(),

        submittedAt: new Date(),
      },
    });

    return res.status(201).json({
      success: true,

      message: "Payment information submitted. Verification pending.",

      order,
    });
  } catch (error) {
    console.error("Manual payment error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,

        message: "এই Transaction ID আগে ব্যবহার করা হয়েছে।",
      });
    }

    return res.status(500).json({
      success: false,

      message: "Payment information submit করা যায়নি।",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Order
|--------------------------------------------------------------------------
*/

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,

        message: "Order পাওয়া যায়নি।",
      });
    }

    return res.json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,

      message: "Invalid order ID.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Manual Verification
|--------------------------------------------------------------------------
|
| পরে Admin Dashboard থেকে এই API call করবেন।
|
*/

const verifyManualPayment = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["paid", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,

        message: "Status paid অথবা rejected হতে হবে।",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order পাওয়া যায়নি।",
      });
    }

    if (order.paymentMethod === "COD") {
      return res.status(400).json({
        success: false,

        message: "COD order manual payment verification প্রয়োজন নেই।",
      });
    }

    order.paymentStatus = status;

    if (status === "paid") {
      order.orderStatus = "confirmed";

      order.manualPayment.verifiedAt = new Date();
    }

    if (status === "rejected") {
      order.orderStatus = "pending";
    }

    await order.save();

    return res.json({
      success: true,

      message: status === "paid" ? "Payment verified." : "Payment rejected.",

      order,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      message: "Payment verification update করা যায়নি।",
    });
  }
};

module.exports = {
  createCodOrder,
  createManualPaymentOrder,
  getOrderById,
  verifyManualPayment,
};
