import Order from "../models/order.model.js";
import Menu from "../models/itemsListing.model.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/customError.js";
import mongoose from "mongoose";

export const confirmOrder = asyncErrorHandler(async (req, res, next) => {
  const { table, orderType, orders, totalPrice } = req.body;

  if (!Array.isArray(orders) || orders.length === 0) {
    return next(new CustomError(400, "Invalid orders format."));
  }

  const newOrder = await Order.create({
    table,
    orderType,
    orders,
    totalPrice,
    isPaymentConfirmed: false,
    active: true,
  });

  res.status(201).json({
    code: 201,
    status: "success",
    message: "Order confirmed. Waiting for payment.",
    data: newOrder,
  });
});

export const confirmPayment = asyncErrorHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { paymentType, paidPrice, extraChange } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return next(new CustomError(404, "Order not found."));
  }

  if (paidPrice < order.totalPrice) {
    return next(
      new CustomError(
        400,
        "Insufficient payment. Please provide a valid amount."
      )
    );
  }

  order.paidPrice = paidPrice;
  order.extraChange = extraChange;
  order.paymentType = paymentType;
  order.isPaymentConfirmed = true;
  order.active = false;

  await order.save();

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Payment confirmed. Order completed.",
    data: order,
  });
});

export const getQueueOrders = asyncErrorHandler(async (req, res, next) => {
  const activeOrders = await Order.find({ active: true }).populate({
    path: "orders",
    select: "dishName price quantity",
  });

  if (!activeOrders.length) {
    return next(new CustomError(200, "No active orders found."));
  }

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Active orders retrieved successfully.",
    data: activeOrders,
  });
});
