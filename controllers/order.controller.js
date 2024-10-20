import Order from "../models/order.model.js";
import Menu from "../models/itemsListing.model.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/customError.js";

export const confirmOrder = asyncErrorHandler(async (req, res, next) => {
  const {
    table,
    tax,
    orderType,
    paymentType,
    orders,
    totalPrice,
    finalPrice,
    paidPrice,
    extraChange,
  } = req.body;

  if (!Array.isArray(orders) || orders.length === 0) {
    return next(new CustomError(400, "Invalid or empty orders array."));
  }

  const newOrder = await Order.create({
    table,
    tax,
    orderType,
    paymentType,
    orders,
    totalPrice,
    finalPrice,
    paidPrice,
    extraChange,
  });

  res.status(201).json({
    code: 201,
    status: "success",
    message: "Order confirmed successfully.",
    data: newOrder,
  });
});

// export const confirmPayment = asyncErrorHandler(async (req, res, next) => {
//   const { orderId } = req.params;
//   const { paymentType, paidPrice, extraChange } = req.body;

//   const order = await Order.findById(orderId);

//   if (!order) {
//     return next(new CustomError(404, "Order not found."));
//   }

//   if (paidPrice < order.totalPrice) {
//     return next(
//       new CustomError(
//         400,
//         "Insufficient payment. Please provide a valid amount."
//       )
//     );
//   }

//   order.paidPrice = paidPrice;
//   order.extraChange = extraChange;
//   order.paymentType = paymentType;
//   order.isPaymentConfirmed = true;
//   order.active = false;

//   await order.save();

//   res.status(200).json({
//     code: 200,
//     status: "success",
//     message: "Payment confirmed. Order completed.",
//     data: order,
//   });
// });

export const getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find();

  if (!orders.length) {
    return next(new CustomError(404, "No orders found."));
  }

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Orders retrieved successfully.",
    data: orders,
  });
});

export const getOrderById = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id);

  if (!order) {
    return next(new CustomError(404, "Order not found."));
  }

  res.status(200).json({
    code: 200,
    status: "success",
    message: "Order details retrieved successfully.",
    data: order,
  });
});

const getStartDate = (type) => {
  const now = new Date();
  if (type === "daily") {
    return new Date(now.setHours(0, 0, 0, 0));
  } else if (type === "weekly") {
    const startOfWeek = now.getDate() - now.getDay();
    return new Date(now.setDate(startOfWeek));
  } else if (type === "monthly") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  throw new CustomError(400, "Invalid report type.");
};

// Get revenue report
export const getRevenueReport = asyncErrorHandler(async (req, res, next) => {
  const { type } = req.query;
  if (!["daily", "weekly", "monthly"].includes(type)) {
    return next(
      new CustomError(
        400,
        "Invalid report type. Use daily, weekly, or monthly."
      )
    );
  }

  const startDate = getStartDate(type);
  const endDate = new Date();

  const orders = await Order.find({
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  if (!orders.length) {
    return next(
      new CustomError(404, `No orders found for the ${type} report.`)
    );
  }

  let totalRevenue = 0;
  let ordersCount = 0;
  const dishesSold = {};

  orders.forEach((order) => {
    totalRevenue += order.totalPrice;
    ordersCount += 1;

    order.orders.forEach((item) => {
      if (!dishesSold[item.dishName]) {
        dishesSold[item.dishName] = {
          quantitySold: 0,
        };
      }
      dishesSold[item.dishName].quantitySold += item.quantity;
    });
  });

  const dishesSoldArray = Object.keys(dishesSold).map((dishName) => ({
    dishName,
    quantitySold: dishesSold[dishName].quantitySold,
  }));

  res.status(200).json({
    code: 200,
    status: "success",
    message: `${
      type.charAt(0).toUpperCase() + type.slice(1)
    } revenue report retrieved successfully.`,
    data: {
      totalRevenue,
      ordersCount,
      dishesSold: dishesSoldArray,
    },
  });
});
