import express from "express";
import {
  confirmOrder,
  confirmPayment,
  getQueueOrders,
} from "../controllers/order.controller.js";
const router = express.Router();

router.post("/", confirmOrder);
router.put("/payment/:orderId", confirmPayment);
router.get("/queue", getQueueOrders);

export default router;
