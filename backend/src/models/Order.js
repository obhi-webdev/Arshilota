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
        required: true,
        trim: true,
        lowercase: true,
      },

      district: {
        type: String,
        required: true,
        trim: true,
      },

      postcode: {
        type: String,
        required: true,
        trim: true,
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

      enum: ["COD", "BKASH_PERSONAL", "NAGAD_PERSONAL", "ROCKET_PERSONAL"],

      required: true,
    },

    paymentStatus: {
      type: String,

      enum: ["unpaid", "verification_pending", "paid", "rejected"],

      default: "unpaid",
    },

    manualPayment: {
      senderPhone: {
        type: String,
        default: null,
      },

      transactionId: {
        type: String,
        default: null,
        trim: true,
      },

      submittedAt: {
        type: Date,
        default: null,
      },

      verifiedAt: {
        type: Date,
        default: null,
      },
    },

    orderStatus: {
      type: String,

      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],

      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.index(
  {
    "manualPayment.transactionId": 1,
  },
  {
    unique: true,
    sparse: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
