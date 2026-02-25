import { firestore } from "./firebase";

/* =========================================================
   FETCH ALL USERS (with optional pagination)
========================================================= */
export const fetchAllUsers = async (limitCount = 100) => {
  try {
    const snap = await firestore
      .collection("users")
      .limit(limitCount)
      .get();

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("fetchAllUsers error:", error);
    throw new Error("Failed to fetch users");
  }
};


/* =========================================================
   FETCH ALL SHOPS (with filtering support)
========================================================= */
export const fetchAllShops = async ({ status } = {}) => {
  try {
    let query = firestore.collection("shops");

    if (status) {
      query = query.where("status", "==", status);
    }

    const snap = await query.get();

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("fetchAllShops error:", error);
    throw new Error("Failed to fetch shops");
  }
};


/* =========================================================
   UPDATE SHOP APPROVAL (Approve / Reject / Suspend)
========================================================= */
export const updateShopApproval = async (id, status) => {
  try {
    if (!id) throw new Error("Shop ID is required");

    await firestore.collection("shops").doc(id).update({
      status,
      reviewedAt: new Date(),
    });

    return { id, status };
  } catch (error) {
    console.error("updateShopApproval error:", error);
    throw new Error("Failed to update shop approval");
  }
};


/* =========================================================
   FETCH ACTIVITY LOGS (latest first)
========================================================= */
export const fetchActivityLogs = async (limitCount = 50) => {
  try {
    const snap = await firestore
      .collection("logs")
      .orderBy("timestamp", "desc")
      .limit(limitCount)
      .get();

    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("fetchActivityLogs error:", error);
    throw new Error("Failed to fetch activity logs");
  }
};


/* =========================================================
   DELETE USER (ADMIN ONLY)
========================================================= */
export const deleteUser = async (userId) => {
  try {
    await firestore.collection("users").doc(userId).delete();
    return userId;
  } catch (error) {
    console.error("deleteUser error:", error);
    throw new Error("Failed to delete user");
  }
};


/* =========================================================
   DELETE SHOP (ADMIN ONLY)
========================================================= */
export const deleteShop = async (shopId) => {
  try {
    await firestore.collection("shops").doc(shopId).delete();
    return shopId;
  } catch (error) {
    console.error("deleteShop error:", error);
    throw new Error("Failed to delete shop");
  }
};


/* =========================================================
   ADMIN DASHBOARD STATS (Aggregated)
========================================================= */
export const fetchAdminStats = async () => {
  try {
    const [usersSnap, shopsSnap, ordersSnap] = await Promise.all([
      firestore.collection("users").get(),
      firestore.collection("shops").get(),
      firestore.collection("orders").get(),
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