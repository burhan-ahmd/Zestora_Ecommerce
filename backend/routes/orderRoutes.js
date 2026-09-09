import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.get("/stats", authMiddleware, roleMiddleware("admin"), getDashboardStats);
router.get("/", authMiddleware, roleMiddleware("admin"), getAllOrders);
router.put("/:id/status", authMiddleware, roleMiddleware("admin"), updateOrderStatus);
router.get("/:id", authMiddleware, getOrderById);

export default router;
