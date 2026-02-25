// src/api/shops.js

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

import { firestore } from "./firebase";

/* =========================================================
   CREATE SHOP
========================================================= */
export const createShop = async (data) => {
  try {
    if (!data?.name || !data?.owner) {
      throw new Error("Shop name and owner required");
    }

    const payload = {
      ...data,
      status: data.status || "pending", // for admin approval flow
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(firestore, "shops"), payload);

    return {
      id: docRef.id,
      ...payload,
    };
  } catch (error) {
    console.error("createShop error:", error);
    throw new Error("Failed to create shop");
  }
};

/* =========================================================
   GET ALL SHOPS
========================================================= */
export const getShops = async () => {
  try {
    const q = query(
      collection(firestore, "shops"),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("getShops error:", error);
    throw new Error("Failed to fetch shops");
  }
};

/* =========================================================
   GET SINGLE SHOP
========================================================= */
export const getShop = async (id) => {
  try {
    if (!id) throw new Error("Shop ID required");

    const snap = await getDoc(doc(firestore, "shops", id));

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    };
  } catch (error) {
    console.error("getShop error:", error);
    throw new Error("Failed to fetch shop");
  }
};

/* =========================================================
   UPDATE SHOP
========================================================= */
export const updateShop = async (id, updates) => {
  try {
    if (!id) throw new Error("Shop ID required");

    await updateDoc(doc(firestore, "shops", id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { id, ...updates };
  } catch (error) {
    console.error("updateShop error:", error);
    throw new Error("Failed to update shop");
  }
};

/* =========================================================
   DELETE SHOP
========================================================= */
export const deleteShop = async (id) => {
  try {
    if (!id) throw new Error("Shop ID required");

    await deleteDoc(doc(firestore, "shops", id));

    return id;
  } catch (error) {
    console.error("deleteShop error:", error);
    throw new Error("Failed to delete shop");
  }
};