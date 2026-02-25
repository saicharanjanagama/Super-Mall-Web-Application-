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
      return { productId, reviews };
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
  async (id, { rejectWithValue }) => {
    try {
      await deleteReview(id);
      return id;
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
    reviewsByProduct: {}, // { productId: [reviews] }
    status: "idle",       // idle | loading | posting | deleting | failed
    error: null,
  },

  reducers: {
    clearReviewError(state) {
      state.error = null;
    },

    resetReviews(state) {
      state.reviewsByProduct = {};
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    /* ================= FETCH ================= */
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = "idle";

        const { productId, reviews } = action.payload;

        state.reviewsByProduct[productId] =
          reviews || [];
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= POST ================= */
    builder
      .addCase(postReview.pending, (state) => {
        state.status = "posting";
        state.error = null;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.status = "idle";

        const review = action.payload;
        const productId = review.productId;

        if (!state.reviewsByProduct[productId]) {
          state.reviewsByProduct[productId] = [];
        }

        state.reviewsByProduct[productId].unshift(
          review
        );
      })
      .addCase(postReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= DELETE ================= */
    builder
      .addCase(removeReview.pending, (state) => {
        state.status = "deleting";
        state.error = null;
      })
      .addCase(removeReview.fulfilled, (state, action) => {
        state.status = "idle";

        const id = action.payload;

        Object.keys(state.reviewsByProduct).forEach(
          (productId) => {
            state.reviewsByProduct[productId] =
              state.reviewsByProduct[
                productId
              ].filter((r) => r.id !== id);
          }
        );
      })
      .addCase(removeReview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

/* =====================================================
   SELECTORS
===================================================== */

export const selectReviewsByProduct =
  (productId) => (state) =>
    state.reviews.reviewsByProduct[productId] ||
    [];

export const selectReviewStatus = (state) =>
  state.reviews.status;

export const selectReviewError = (state) =>
  state.reviews.error;

/* =====================================================
   EXPORT
===================================================== */

export const {
  clearReviewError,
  resetReviews,
} = slice.actions;

export default slice.reducer;