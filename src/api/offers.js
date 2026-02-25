// src/api/offers.js

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { firestore } from "./firebase";

/* =========================================================
   GET ALL OFFERS
========================================================= */
export const getAllOffers = async () => {
  try {
    const snap = await getDocs(collection(firestore, "offers"));

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error("getAllOffers error:", error);
    throw new Error("Failed to fetch offers");
  }
};

/* =========================================================
   ADD OFFER
========================================================= */
export const addOffer = async (data) => {
  try {
    if (!data?.shopId) {
      throw new Error("Shop ID is required");
    }

    const docRef = await addDoc(collection(firestore, "offers"), {
      ...data,
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      ...data,
    };
  } catch (error) {
    console.error("addOffer error:", error);
    throw new Error("Failed to create offer");
  }
};

/* =========================================================
   GET OFFERS BY SHOP
========================================================= */
export const getOffersByShop = async (shopId) => {
  try {
    if (!shopId) throw new Error("Shop ID missing");

    const q = query(
      collection(firestore, "offers"),
      where("shopId", "==", shopId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error("getOffersByShop error:", error);
    throw new Error("Failed to fetch shop offers");
  }
};

/* =========================================================
   DELETE OFFER
========================================================= */
export const deleteOffer = async (id) => {
  try {
    if (!id) throw new Error("Offer ID required");

    await deleteDoc(doc(firestore, "offers", id));
    return id;
  } catch (error) {
    console.error("deleteOffer error:", error);
    throw new Error("Failed to delete offer");
  }
};

/* =========================================================
   UPDATE OFFER
========================================================= */
export const updateOffer = async (id, updates) => {
  try {
    if (!id) throw new Error("Offer ID required");

    await updateDoc(doc(firestore, "offers", id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { id, ...updates };
  } catch (error) {
    console.error("updateOffer error:", error);
    throw new Error("Failed to update offer");
  }
};