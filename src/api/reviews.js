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
} from "firebase/firestore";

import { firestore } from "./firebase";

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

    const reviewRef = await addDoc(collection(firestore, "reviews"), {
      productId,
      userId,
      rating,
      comment: comment || "",
      createdAt: serverTimestamp(),
    });

    // Transaction: update product rating safely
    await runTransaction(firestore, async (transaction) => {
      const productRef = doc(firestore, "products", productId);
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
      collection(firestore, "reviews"),
      where("productId", "==", productId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
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

    const reviewRef = doc(firestore, "reviews", reviewId);
    const reviewSnap = await reviewRef.get?.() // fallback safety
      ? await reviewRef.get()
      : null;

    // Modular safe fetch:
    const reviewQuery = await getDocs(
      query(collection(firestore, "reviews"), where("__name__", "==", reviewId))
    );

    if (reviewQuery.empty) {
      throw new Error("Review not found");
    }

    const reviewData = reviewQuery.docs[0].data();
    const productId = reviewData.productId;

    await deleteDoc(reviewRef);

    // Recalculate product rating
    const reviewsSnap = await getDocs(
      query(
        collection(firestore, "reviews"),
        where("productId", "==", productId)
      )
    );

    const reviews = reviewsSnap.docs.map((d) => d.data());

    const count = reviews.length;
    const avg =
      count === 0
        ? 0
        : reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / count;

    await runTransaction(firestore, async (transaction) => {
      const productRef = doc(firestore, "products", productId);

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