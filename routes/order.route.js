import express from "express";
import {
  confirmOrder,
  getAllOrders,
  getOrderById,
  getRevenueReport,
} from "../controllers/order.controller.js";
const router = express.Router();

router.get("/revenue-report", getRevenueReport);
router.post("/", confirmOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);

export default router;
