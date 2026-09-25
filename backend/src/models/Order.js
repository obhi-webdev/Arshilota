const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },

      district: {
        type: String,
        required: true,
        trim: true,
      },

      postcode: {
        type: String,
        trim: true,
        default: "",
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    product: {
      productId: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        required: true,
      },

      unitPrice: {
        type: Number,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },

    subtotal: {
      type: Number,
      required: true,
    },

    deliveryCharge: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    orderStatus: {
      type: String,

      enum: ["confirmed", "processing", "shipped", "delivered", "cancelled"],

      default: "confirmed",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
