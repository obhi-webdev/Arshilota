const Order = require("../models/Order");
const PRODUCT = require("../config/product");

const { generateOrderNumber } = require("../utils/generateId");

const isCustomerValid = (customer) => {
  return Boolean(
    customer &&
    customer.name &&
    customer.phone &&
    customer.district &&
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

const cleanCustomer = (customer) => {
  return {
    name: customer.name.trim(),

    phone: customer.phone.trim(),

    email: customer.email?.trim().toLowerCase() || "",

    district: customer.district.trim(),

    postcode: customer.postcode?.trim() || "",

    address: customer.address.trim(),
  };
};

const createCodOrder = async (req, res) => {
  try {
    const { customer, quantity } = req.body;

    if (!isCustomerValid(customer)) {
      return res.status(400).json({
        success: false,
        message: "নাম, মোবাইল নম্বর, জেলা এবং ঠিকানা পূরণ করুন।",
      });
    }

    const qty = getQuantity(quantity);

    if (!qty) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity.",
      });
    }

    const subtotal = PRODUCT.price * qty;

    const deliveryCharge = PRODUCT.deliveryCharge;

    const total = subtotal + deliveryCharge;

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

      message: "Order successfully created.",

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
      message: "Invalid Order ID.",
    });
  }
};

module.exports = {
  createCodOrder,
  getOrderById,
};
