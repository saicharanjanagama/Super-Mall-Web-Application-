// src/api/products.js

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { firestore } from "./firebase";

/* =========================================================
   CREATE PRODUCT
========================================================= */
export const createProduct = async (data) => {
  try {
    if (!data?.name || !data?.price || !data?.shopId) {
      throw new Error("Missing required product fields");
    }

    const payload = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(firestore, "products"), payload);

    return {
      id: docRef.id,
      ...payload,
    };
  } catch (error) {
    console.error("createProduct error:", error);
    throw new Error("Failed to create product");
  }
};

/* =========================================================
   GET PRODUCTS
========================================================= */
export const getProducts = async (shopId = null) => {
  try {
    let q;

    if (shopId) {
      q = query(
        collection(firestore, "products"),
        where("shopId", "==", shopId),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(firestore, "products"),
        orderBy("createdAt", "desc")
      );
    }

    const snap = await getDocs(q);

    return snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

  } catch (error) {
    console.error("getProducts error:", error);
    throw new Error("Failed to fetch products");
  }
};

/* =========================================================
   UPDATE PRODUCT
========================================================= */
export const updateProduct = async (id, data) => {
  try {
    if (!id) throw new Error("Product ID required");

    await updateDoc(doc(firestore, "products", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });

    return { id, ...data };
  } catch (error) {
    console.error("updateProduct error:", error);
    throw new Error("Failed to update product");
  }
};

/* =========================================================
   DELETE PRODUCT
========================================================= */
export const deleteProduct = async (id) => {
  try {
    if (!id) throw new Error("Product ID required");

    await deleteDoc(doc(firestore, "products", id));

    return id;
  } catch (error) {
    console.error("deleteProduct error:", error);
    throw new Error("Failed to delete product");
  }
};