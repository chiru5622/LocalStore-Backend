// src/routes/orderRoutes.js
import express from "express";
import {
  createOrderHandler,
  getOrder,
  getOrderByNumber,
  getCustomerOrders,
  getManagerOrders,
  getDeliveryOrders,
  updateStatus,
  assignDelivery,
} from "../controllers/orderController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

// Public route - for order tracking by order number
router.get("/track/:orderNumber", getOrderByNumber);

// Customer routes
router.post("/", verifyToken, authorizeRoles("customer"), createOrderHandler);
router.get(
  "/my-orders",
  verifyToken,
  authorizeRoles("customer"),
  getCustomerOrders
);
router.get(
  "/my-orders/:id",
  verifyToken,
  authorizeRoles("customer"),
  getOrder
);

// Manager routes
router.get(
  "/manager/all",
  verifyToken,
  authorizeRoles("manager"),
  getManagerOrders
);
router.patch(
  "/manager/:id/status",
  verifyToken,
  authorizeRoles("manager"),
  updateStatus
);
router.patch(
  "/manager/:id/assign-delivery",
  verifyToken,
  authorizeRoles("manager"),
  assignDelivery
);

// Delivery routes
router.get(
  "/delivery/all",
  verifyToken,
  authorizeRoles("delivery"),
  getDeliveryOrders
);
router.patch(
  "/delivery/:id/status",
  verifyToken,
  authorizeRoles("delivery"),
  updateStatus
);

export default router;
