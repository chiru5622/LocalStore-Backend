// src/controllers/orderController.js
import {
  createOrder,
  getOrderById,
  getOrderByOrderNumber,
  getOrdersByCustomer,
  getAllOrders,
  getOrdersForDelivery,
  updateOrderStatus,
  assignDeliveryPartner,
} from "../models/orderModel.js";

/* =======================================================
   🔹 CREATE ORDER (CUSTOMER)
======================================================= */
export const createOrderHandler = async (req, res) => {
  try {
    const { items, total, deliveryAddress } = req.body;
    const customerId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items are required",
      });
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid total is required",
      });
    }

    const orderData = {
      customerId,
      items,
      total,
      deliveryAddress: deliveryAddress || "",
    };

    const order = await createOrder(orderData);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 GET ORDER BY ID
======================================================= */
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      req.user.role !== "manager" &&
      req.user.role !== "delivery" &&
      order.customerId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 GET ORDER BY ORDER NUMBER (PUBLIC TRACKING)
======================================================= */
export const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await getOrderByOrderNumber(orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 GET CUSTOMER ORDERS
======================================================= */
export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const orders = await getOrdersByCustomer(customerId);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("❌ Error fetching customer orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 GET ALL ORDERS (MANAGER)
======================================================= */
export const getManagerOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const orders = await getAllOrders(status);

    const transformedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer?.name || "Guest",
      items: order.items.map((item) => ({
        id: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.image,
      })),
      total: order.total,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      timestamp: order.createdAt,
      manager: "manager",
    }));

    res.status(200).json({
      success: true,
      data: transformedOrders,
    });
  } catch (error) {
    console.error("❌ Error fetching manager orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 GET DELIVERY ORDERS (ROLE = delivery)
   → Shows all orders in delivery stage
======================================================= */
export const getDeliveryOrders = async (req, res) => {
  try {
    // we don't filter by specific deliveryPartnerId now;
    // any user with role "delivery" sees the pool of delivery orders.
    const orders = await getOrdersForDelivery();

    const transformedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customer?.name || "Guest",
      items: order.items.map((item) => ({
        id: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.image,
      })),
      total: order.total,
      status: order.status,
      deliveryAddress: order.deliveryAddress,
      pickup: "manager",
      timestamp: order.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: transformedOrders,
    });
  } catch (error) {
    console.error("❌ Error fetching delivery orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 UPDATE ORDER STATUS (MANAGER / DELIVERY)
   - Lets model handle validation & mapping
======================================================= */
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID missing in URL",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const updatedOrder = await updateOrderStatus(id, status);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

/* =======================================================
   🔹 ASSIGN DELIVERY PARTNER (MANUAL)
   - Still available separately if needed
======================================================= */
export const assignDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryPartnerId } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID missing in URL",
      });
    }

    if (!deliveryPartnerId) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner ID is required",
      });
    }

    const order = await assignDeliveryPartner(id, deliveryPartnerId);

    res.status(200).json({
      success: true,
      message: "Delivery partner assigned successfully",
      data: order,
    });
  } catch (error) {
    console.error("❌ Error assigning delivery partner:", error);
    res.status(500).json({
      success: false,
      message: "Error assigning delivery partner",
      error: error.message,
    });
  }
};
