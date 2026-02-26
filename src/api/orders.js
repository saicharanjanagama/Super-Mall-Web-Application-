// src/api/orders.js

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

/* =========================================================
   HELPER → Convert Firestore Timestamp
========================================================= */
const formatDoc = (docItem) => {
  const data = docItem.data();

  return {
    id: docItem.id,
    ...data,
    createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
    updatedAt: data.updatedAt?.toDate?.().toISOString?.() || null,
  };
};

/* =========================================================
   CREATE ORDER
========================================================= */
export async function createOrder(order) {
  try {
    if (!order?.userId) {
      throw new Error("User ID is required");
    }

    const payload = {
      ...order,
      status: order.status || "Pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const ref = await addDoc(collection(db, "orders"), payload);

    return {
      id: ref.id,
      ...order,
      status: payload.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("createOrder error:", error);
    throw new Error("Failed to create order");
  }
}

/* =========================================================
   GET ORDERS BY USER
========================================================= */
export async function getOrdersByUser(userId) {
  try {
    if (!userId) throw new Error("User ID required");

    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map(formatDoc);
  } catch (error) {
    console.error("getOrdersByUser error:", error);
    throw new Error("Failed to fetch user orders");
  }
}

/* =========================================================
   GET ALL ORDERS (ADMIN)
========================================================= */
export async function getAllOrders() {
  try {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map(formatDoc);
  } catch (error) {
    console.error("getAllOrders error:", error);
    throw new Error("Failed to fetch all orders");
  }
}

/* =========================================================
   GET ORDERS BY MERCHANT
========================================================= */
export async function getOrdersByMerchant(merchantId) {
  try {
    if (!merchantId) throw new Error("Merchant ID required");

    const q = query(
      collection(db, "orders"),
      where("merchantId", "==", merchantId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map(formatDoc);
  } catch (error) {
    console.error("getOrdersByMerchant error:", error);
    throw new Error("Failed to fetch merchant orders");
  }
}

/* =========================================================
   UPDATE ORDER STATUS
========================================================= */
export async function updateOrderStatus(orderId, updates) {
  try {
    if (!orderId) throw new Error("Order ID required");

    await updateDoc(doc(db, "orders", orderId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return {
      orderId,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    throw new Error("Failed to update order status");
  }
}