// src/api/reviews.js

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
  serverTimestamp,
  runTransaction,
  getDoc,
} from "firebase/firestore";

import { db } from "./firebase";

/* =========================================================
   HELPER → Convert Timestamp
========================================================= */
const formatDoc = (docItem) => {
  const data = docItem.data();

  return {
    id: docItem.id,
    ...data,
    createdAt: data.createdAt?.toDate?.().toISOString?.() || null,
  };
};

/* =========================================================
   ADD REVIEW (Transaction Safe)
========================================================= */
export const addReview = async ({
  productId,
  userId,
  rating,
  comment,
}) => {
  try {
    if (!productId || !userId) {
      throw new Error("Product ID and User ID required");
    }

    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const reviewRef = await addDoc(collection(db, "reviews"), {
      productId,
      userId,
      rating,
      comment: comment || "",
      createdAt: serverTimestamp(),
    });

    // Transaction: update product rating
    await runTransaction(db, async (transaction) => {
      const productRef = doc(db, "products", productId);
      const productSnap = await transaction.get(productRef);

      if (!productSnap.exists()) {
        throw new Error("Product not found");
      }

      const productData = productSnap.data();
      const currentCount = productData.reviewCount || 0;
      const currentAvg = productData.avgRating || 0;

      const newCount = currentCount + 1;
      const newAvg =
        (currentAvg * currentCount + rating) / newCount;

      transaction.update(productRef, {
        reviewCount: newCount,
        avgRating: Number(newAvg.toFixed(2)),
      });
    });

    return {
      id: reviewRef.id,
      productId,
      userId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("addReview error:", error);
    throw new Error("Failed to add review");
  }
};

/* =========================================================
   GET REVIEWS BY PRODUCT
========================================================= */
export const getReviews = async (productId) => {
  try {
    if (!productId) throw new Error("Product ID required");

    const q = query(
      collection(db, "reviews"),
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map(formatDoc);
  } catch (error) {
    console.error("getReviews error:", error);
    throw new Error("Failed to fetch reviews");
  }
};

/* =========================================================
   DELETE REVIEW (Recalculate Rating)
========================================================= */
export const deleteReview = async (reviewId) => {
  try {
    if (!reviewId) throw new Error("Review ID required");

    const reviewRef = doc(db, "reviews", reviewId);
    const reviewSnap = await getDoc(reviewRef);

    if (!reviewSnap.exists()) {
      throw new Error("Review not found");
    }

    const reviewData = reviewSnap.data();
    const productId = reviewData.productId;

    await deleteDoc(reviewRef);

    // Get remaining reviews
    const reviewsSnap = await getDocs(
      query(
        collection(db, "reviews"),
        where("productId", "==", productId)
      )
    );

    const reviews = reviewsSnap.docs.map((d) => d.data());

    const count = reviews.length;
    const avg =
      count === 0
        ? 0
        : reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / count;

    await runTransaction(db, async (transaction) => {
      const productRef = doc(db, "products", productId);

      transaction.update(productRef, {
        reviewCount: count,
        avgRating: Number(avg.toFixed(2)),
      });
    });

    return reviewId;
  } catch (error) {
    console.error("deleteReview error:", error);
    throw new Error("Failed to delete review");
  }
};