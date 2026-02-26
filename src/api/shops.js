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
   CREATE SHOP
========================================================= */
export const createShop = async (data) => {
  try {
    if (!data?.name || !data?.owner) {
      throw new Error("Shop name and owner required");
    }

    const payload = {
      ...data,
      status: data.status || "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "shops"), payload);

    return {
      id: docRef.id,
      ...data,
      status: payload.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      collection(db, "shops"),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map(formatDoc);
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

    const snap = await getDoc(doc(db, "shops", id));

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
      createdAt: snap.data().createdAt?.toDate?.().toISOString?.() || null,
      updatedAt: snap.data().updatedAt?.toDate?.().toISOString?.() || null,
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

    await updateDoc(doc(db, "shops", id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
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

    await deleteDoc(doc(db, "shops", id));
    return id;
  } catch (error) {
    console.error("deleteShop error:", error);
    throw new Error("Failed to delete shop");
  }
};