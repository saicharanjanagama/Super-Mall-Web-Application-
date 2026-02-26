// src/features/reviews/reviewsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addReview,
  getReviews,
  deleteReview,
} from "../../api/reviews";

/* =====================================================
   FETCH REVIEWS
===================================================== */
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const reviews = await getReviews(productId);
      return { productId, reviews: reviews || [] };
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch reviews"
      );
    }
  }
);

/* =====================================================
   POST REVIEW
===================================================== */
export const postReview = createAsyncThunk(
  "reviews/postReview",
  async (data, { rejectWithValue }) => {
    try {
      return await addReview(data);
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to post review"
      );
    }
  }
);

/* =====================================================
   REMOVE REVIEW
===================================================== */
export const removeReview = createAsyncThunk(
  "reviews/removeReview",
  async ({ id, productId }, { rejectWithValue }) => {
    try {
      await deleteReview(id);
      return { id, productId };
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to delete review"
      );
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const slice = createSlice({
  name: "reviews",

  initialState: {
    reviewsByProduct: {},     // { productId: [reviews] }
    statusByProduct: {},      // { productId: status }
    errorByProduct: {},       // { productId: error }
  },

  reducers: {
    clearReviewError(state, action) {
      const productId = action.payload;
      if (productId) {
        state.errorByProduct[productId] = null;
      }
    },

    resetReviews(state) {
      state.reviewsByProduct = {};
      state.statusByProduct = {};
      state.errorByProduct = {};
    },
  },

  extraReducers: (builder) => {
    /* ================= FETCH ================= */
    builder
      .addCase(fetchReviews.pending, (state, action) => {
        const productId = action.meta.arg;
        state.statusByProduct[productId] = "loading";
        state.errorByProduct[productId] = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        const { productId, reviews } = action.payload;

        state.statusByProduct[productId] = "idle";

        // Sort newest first (safe date handling)
        const sorted = [...reviews].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        state.reviewsByProduct[productId] = sorted;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.statusByProduct[productId] = "failed";
        state.errorByProduct[productId] = action.payload;
      });

    /* ================= POST ================= */
    builder
      .addCase(postReview.pending, (state, action) => {
        const productId = action.meta.arg.productId;
        state.statusByProduct[productId] = "posting";
        state.errorByProduct[productId] = null;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        const review = action.payload;
        const productId = review.productId;

        state.statusByProduct[productId] = "idle";

        if (!state.reviewsByProduct[productId]) {
          state.reviewsByProduct[productId] = [];
        }

        // Prevent duplicates
        const exists =
          state.reviewsByProduct[productId].some(
            (r) => r.id === review.id
          );

        if (!exists) {
          state.reviewsByProduct[productId].unshift(
            review
          );
        }
      })
      .addCase(postReview.rejected, (state, action) => {
        const productId = action.meta.arg.productId;
        state.statusByProduct[productId] = "failed";
        state.errorByProduct[productId] = action.payload;
      });

    /* ================= DELETE ================= */
    builder
      .addCase(removeReview.pending, (state, action) => {
        const { productId } = action.meta.arg;
        state.statusByProduct[productId] = "deleting";
      })
      .addCase(removeReview.fulfilled, (state, action) => {
        const { id, productId } = action.payload;

        state.statusByProduct[productId] = "idle";

        if (!state.reviewsByProduct[productId]) return;

        state.reviewsByProduct[productId] =
          state.reviewsByProduct[productId].filter(
            (r) => r.id !== id
          );
      })
      .addCase(removeReview.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        state.statusByProduct[productId] = "failed";
        state.errorByProduct[productId] = action.payload;
      });
  },
});

/* =====================================================
   SELECTORS
===================================================== */

export const selectReviewsByProduct =
  (productId) => (state) =>
    state.reviews.reviewsByProduct[productId] || [];

export const selectReviewStatus =
  (productId) => (state) =>
    state.reviews.statusByProduct[productId] || "idle";

export const selectReviewError =
  (productId) => (state) =>
    state.reviews.errorByProduct[productId] || null;

/* =====================================================
   EXPORT
===================================================== */

export const {
  clearReviewError,
  resetReviews,
} = slice.actions;

export default slice.reducer;