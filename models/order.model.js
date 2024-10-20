import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    table: { type: String, required: true },

    tax: { type: Number },

    orderType: {
      type: String,
      required: true,
      enum: ["Take Away", "Delivery", "Dine In"],
      default: "Dine In",
    },

    paymentType: {
      type: String,
      enum: ["Cash", "Card", "Online Banking"],
      default: null,
    },

    orders: [
      {
        dishName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],

    totalPrice: { type: Number, required: true },
    finalPrice: { type: Number, required: true },
    paidPrice: {
      type: Number,
      required: true,
    },
    extraChange: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
