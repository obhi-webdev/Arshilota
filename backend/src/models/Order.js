const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Order Number
    |--------------------------------------------------------------------------
    */

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Customer Information
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Product Information
    |--------------------------------------------------------------------------
    */

    product: {
      productId: {
        type: String,
        required: true,
        trim: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Price
    |--------------------------------------------------------------------------
    */

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryCharge: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | Payment
    |--------------------------------------------------------------------------
    */

    paymentMethod: {
      type: String,
      enum: ["COD"],
      default: "COD",
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },

    /*
    |--------------------------------------------------------------------------
    | Order Status
    |--------------------------------------------------------------------------
    */

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

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
|
| Same phone number-এর recent order দ্রুত search করার জন্য।
| Controller-এর 2-hour duplicate order protection এই index ব্যবহার করবে।
|
*/

orderSchema.index({
  "customer.phone": 1,
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Model
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model("Order", orderSchema);
