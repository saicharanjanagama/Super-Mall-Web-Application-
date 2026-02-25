// src/api/wishlist.js

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { firestore } from "./firebase";

/* =========================================================
   ADD TO WISHLIST
   Uses deterministic doc ID to prevent duplicates
========================================================= */
export const addWishlist = async ({ userId, productId }) => {
  try {
    if (!userId || !productId) {
      throw new Error("User ID and Product ID required");
    }

    const wishlistId = `${userId}_${productId}`;

    await setDoc(
      doc(firestore, "wishlist", wishlistId),
      {
        userId,
        productId,
        addedAt: serverTimestamp(),
      }
    );

    return productId;
  } catch (error) {
    console.error("addWishlist error:", error);
    throw new Error("Failed to add to wishlist");
  }
};

/* =========================================================
   REMOVE FROM WISHLIST
========================================================= */
export const removeWishlist = async ({ userId, productId }) => {
  try {
    if (!userId || !productId) {
      throw new Error("User ID and Product ID required");
    }

    const wishlistId = `${userId}_${productId}`;

    await deleteDoc(doc(firestore, "wishlist", wishlistId));

    return productId;
  } catch (error) {
    console.error("removeWishlist error:", error);
    throw new Error("Failed to remove from wishlist");
  }
};

/* =========================================================
   GET USER WISHLIST
========================================================= */
export const getWishlist = async (userId) => {
  try {
    if (!userId) throw new Error("User ID required");

    const q = query(
      collection(firestore, "wishlist"),
      where("userId", "==", userId)
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => d.data().productId);
  } catch (error) {
    console.error("getWishlist error:", error);
    throw new Error("Failed to fetch wishlist");
  }
};