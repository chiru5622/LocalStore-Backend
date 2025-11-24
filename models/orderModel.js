// src/models/orderModel.js
import prisma from "../config/prisma.js";

/* =======================================================
   🔹 CREATE ORDER
======================================================= */
export const createOrder = async (orderData) => {
  try {
    const { customerId, items, total, deliveryAddress } = orderData;

    const order = await prisma.order.create({
      data: {
        customerId: parseInt(customerId),
        total: parseFloat(total),
        deliveryAddress: deliveryAddress || "",
        status: "CONFIRMED",
        items: {
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: parseFloat(item.price),
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        customer: { select: { id: true, name: true, email: true } },
      },
    });

    // Decrease stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return order;
  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    throw error;
  }
};

/* =======================================================
   🔹 GET ORDER BY ID (String ID)
======================================================= */
export const getOrderById = async (id) => {
  try {
    return await prisma.order.findUnique({
      where: { id }, // cuid string
      include: {
        items: { include: { product: true } },
        customer: { select: { id: true, name: true, email: true } },
        deliveryPartner: { select: { id: true, name: true, email: true } },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching order:", error.message);
    throw error;
  }
};

/* =======================================================
   🔹 GET ORDER BY ORDER NUMBER
======================================================= */
export const getOrderByOrderNumber = async (orderNumber) => {
  try {
    return await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: true } },
        customer: { select: { id: true, name: true, email: true } },
        deliveryPartner: { select: { id: true, name: true, email: true } },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching order by order number:", error.message);
    throw error;
  }
};

/* =======================================================
   🔹 GET CUSTOMER ORDERS
======================================================= */
export const getOrdersByCustomer = async (customerId) => {
  try {
    return await prisma.order.findMany({
      where: { customerId: parseInt(customerId) },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("❌ Error fetching customer orders:", error.message);
    throw error;
  }
};

/* =======================================================
   🔹 GET ALL ORDERS (MANAGER VIEW)
======================================================= */
export const getAllOrders = async (status = null) => {
  try {
    const where = status ? { status } : {};

    return await prisma.order.findMany({
      where,
      include: {
        items: { include: { product: true } },
        customer: { select: { id: true, name: true, email: true } },
        deliveryPartner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("❌ Error fetching all orders:", error.message);
    throw error;
  }
};

/* =======================================================
   🔹 GET ORDERS FOR DELIVERY (ROLE-BASED, NOT BY ID)
   → All orders in delivery stage for users with role "delivery"
======================================================= */
export const getOrdersForDelivery = async () => {
  try {
    // Orders that are relevant for delivery partners
    const deliveryStatuses = ["READY", "OUT_FOR_DELIVERY", "DELIVERED"];

    return await prisma.order.findMany({
      where: {
        status: { in: deliveryStatuses },
      },
      include: {
        items: { include: { product: true } },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        deliveryPartner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("❌ Error fetching delivery orders:", error.message);
    throw error;
  }
};

/* =======================================================
   🔹 UPDATE ORDER STATUS
   - Handles "ACCEPTED" from delivery app
   - Does NOT depend on deliveryPartnerId, only role-based access
======================================================= */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const id = orderId; // cuid string

    if (!status) {
      throw new Error("Status is required");
    }

    const requested = status.toUpperCase();

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "READY",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "REJECTED",
      "ACCEPTED", // alias from delivery app
    ];

    if (!allowedStatuses.includes(requested)) {
      throw new Error(`Invalid status: ${requested}`);
    }

    // Map UI "ACCEPTED" → DB "OUT_FOR_DELIVERY"
    let normalizedStatus = requested;
    if (requested === "ACCEPTED") {
      normalizedStatus = "OUT_FOR_DELIVERY";
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: normalizedStatus,
        // NOTE: we are NOT touching assignedDeliveryId here.
        // Orders are visible to all users with role "delivery".
      },
      include: {
        items: { include: { product: true } },
        customer: { select: { id: true, name: true, email: true } },
        deliveryPartner: { select: { id: true, name: true, email: true } },
      },
    });

    console.log("✅ Order updated:", {
      id: updated.id,
      status: updated.status,
      assignedDeliveryId: updated.assignedDeliveryId,
    });

    return updated;
  } catch (error) {
    console.error("❌ Error updating order status:", error.message);
    throw error;
  }
};

/* =======================================================
   🔹 ASSIGN DELIVERY PARTNER MANUALLY
   (still available, but not used in auto flow)
======================================================= */
export const assignDeliveryPartner = async (orderId, deliveryPartnerId) => {
  try {
    return await prisma.order.update({
      where: { id: orderId },
      data: {
        assignedDeliveryId: parseInt(deliveryPartnerId),
        status: "OUT_FOR_DELIVERY",
      },
      include: {
        items: { include: { product: true } },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            latitude: true,
            longitude: true,
          },
        },
        deliveryPartner: { select: { id: true, name: true, email: true } },
      },
    });
  } catch (error) {
    console.error("❌ Error assigning delivery partner:", error.message);
    throw error;
  }
};
