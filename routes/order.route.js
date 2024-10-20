import express from "express";
import {
  confirmOrder,
  getAllOrders,
  getOrderById,
  getRevenueReport,
} from "../controllers/order.controller.js";
const router = express.Router();

router.post("/", confirmOrder);
router.get("/", getAllOrders);
router.get("/revenue-report", getRevenueReport);
router.get("/:id", getOrderById);

export default router;
