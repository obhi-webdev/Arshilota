const Order = require("../models/Order");
const PRODUCT = require("../config/product");

const { generateOrderNumber } = require("../utils/generateId");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const normalizePhone = (phone = "") => {
  let value = String(phone).replace(/\D/g, "");

  // +8801XXXXXXXXX / 8801XXXXXXXXX -> 01XXXXXXXXX
  if (value.startsWith("880")) {
    value = "0" + value.slice(3);
  }

  return value;
};

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

    phone: normalizePhone(customer.phone),

    email: customer.email?.trim().toLowerCase() || "",

    district: customer.district.trim(),

    postcode: customer.postcode?.trim() || "",

    address: customer.address.trim(),
  };
};

/*
|--------------------------------------------------------------------------
| Create COD Order
|--------------------------------------------------------------------------
*/

const createCodOrder = async (req, res) => {
  try {
    const { customer, quantity } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validate Customer
    |--------------------------------------------------------------------------
    */

    if (!isCustomerValid(customer)) {
      return res.status(400).json({
        success: false,

        message: "নাম, মোবাইল নম্বর, জেলা এবং ঠিকানা পূরণ করুন।",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Quantity
    |--------------------------------------------------------------------------
    */

    const qty = getQuantity(quantity);

    if (!qty) {
      return res.status(400).json({
        success: false,

        message: "Invalid quantity.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Clean Customer
    |--------------------------------------------------------------------------
    */

    const customerData = cleanCustomer(customer);

    /*
    |--------------------------------------------------------------------------
    | 2 Hour Duplicate Order Protection
    |--------------------------------------------------------------------------
    |
    | একই mobile number দিয়ে গত 2 ঘণ্টার মধ্যে active order থাকলে
    | নতুন order নেওয়া হবে না।
    |
    */

    const TWO_HOURS = 2 * 60 * 60 * 1000;

    const twoHoursAgo = new Date(Date.now() - TWO_HOURS);

    const recentOrder = await Order.findOne({
      "customer.phone": customerData.phone,

      createdAt: {
        $gte: twoHoursAgo,
      },

      orderStatus: {
        $ne: "cancelled",
      },
    }).sort({
      createdAt: -1,
    });

    if (recentOrder) {
      const unlockTime = new Date(recentOrder.createdAt.getTime() + TWO_HOURS);

      const remainingMs = unlockTime.getTime() - Date.now();

      const remainingMinutes = Math.max(
        1,
        Math.ceil(remainingMs / (60 * 1000)),
      );

      return res.status(429).json({
        success: false,

        message: `এই মোবাইল নম্বর থেকে ইতোমধ্যে একটি অর্ডার করা হয়েছে। আবার অর্ডার করতে প্রায় ${remainingMinutes} মিনিট অপেক্ষা করুন।`,

        retryAfterMinutes: remainingMinutes,

        previousOrderNumber: recentOrder.orderNumber,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Calculate Order
    |--------------------------------------------------------------------------
    */

    const subtotal = PRODUCT.price * qty;

    const deliveryCharge = PRODUCT.deliveryCharge;

    const total = subtotal + deliveryCharge;

    /*
    |--------------------------------------------------------------------------
    | Create Order
    |--------------------------------------------------------------------------
    */

    const order = await Order.create({
      orderNumber: generateOrderNumber(),

      customer: customerData,

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

    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

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

      message: "Invalid Order ID.",
    });
  }
};

module.exports = {
  createCodOrder,
  getOrderById,
};
