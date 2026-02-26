// src/api/adminApi.js (or wherever this file is)

import { db } from "./firebase";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

/* =========================================================
   FETCH ALL USERS
========================================================= */
export const fetchAllUsers = async (limitCount = 100) => {
  try {
    const q = query(collection(db, "users"), limit(limitCount));
    const snap = await getDocs(q);

    return snap.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
  } catch (error) {
    console.error("fetchAllUsers error:", error);
    throw new Error("Failed to fetch users");
  }
};

/* =========================================================
   FETCH ALL SHOPS
========================================================= */
export const fetchAllShops = async ({ status } = {}) => {
  try {
    let q = collection(db, "shops");

    if (status) {
      q = query(collection(db, "shops"), where("status", "==", status));
    }

    const snap = await getDocs(q);

    return snap.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
  } catch (error) {
    console.error("fetchAllShops error:", error);
    throw new Error("Failed to fetch shops");
  }
};

/* =========================================================
   UPDATE SHOP APPROVAL
========================================================= */
export const updateShopApproval = async (id, status) => {
  try {
    if (!id) throw new Error("Shop ID is required");

    const shopRef = doc(db, "shops", id);

    await updateDoc(shopRef, {
      status,
      reviewedAt: new Date().toISOString(), // avoid Timestamp issues
    });

    return { id, status };
  } catch (error) {
    console.error("updateShopApproval error:", error);
    throw new Error("Failed to update shop approval");
  }
};

/* =========================================================
   FETCH ACTIVITY LOGS
========================================================= */
export const fetchActivityLogs = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, "logs"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const snap = await getDocs(q);

    return snap.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
  } catch (error) {
    console.error("fetchActivityLogs error:", error);
    throw new Error("Failed to fetch activity logs");
  }
};

/* =========================================================
   DELETE USER
========================================================= */
export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, "users", userId));
    return userId;
  } catch (error) {
    console.error("deleteUser error:", error);
    throw new Error("Failed to delete user");
  }
};

/* =========================================================
   DELETE SHOP
========================================================= */
export const deleteShop = async (shopId) => {
  try {
    await deleteDoc(doc(db, "shops", shopId));
    return shopId;
  } catch (error) {
    console.error("deleteShop error:", error);
    throw new Error("Failed to delete shop");
  }
};

/* =========================================================
   ADMIN DASHBOARD STATS
========================================================= */
export const fetchAdminStats = async () => {
  try {
    const [usersSnap, shopsSnap, ordersSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "shops")),
      getDocs(collection(db, "orders")),
    ]);

    return {
      totalUsers: usersSnap.size,
      totalShops: shopsSnap.size,
      totalOrders: ordersSnap.size,
    };
  } catch (error) {
    console.error("fetchAdminStats error:", error);
    throw new Error("Failed to fetch dashboard stats");
  }
};