// src/features/wishlist/wishlistSlice.js

import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  addWishlist,
  removeWishlist,
  getWishlist,
} from "../../api/wishlist";

/* =====================================================
   FETCH WISHLIST
===================================================== */

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      return await getWishlist(userId);
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch wishlist"
      );
    }
  }
);

/* =====================================================
   ADD ITEM
===================================================== */

export const addWishlistItem = createAsyncThunk(
  "wishlist/add",
  async (
    { userId, productId },
    { rejectWithValue }
  ) => {
    try {
      await addWishlist({ userId, productId });
      return productId;
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to add to wishlist"
      );
    }
  }
);

/* =====================================================
   REMOVE ITEM
===================================================== */

export const removeWishlistItem = createAsyncThunk(
  "wishlist/remove",
  async (
    { userId, productId },
    { rejectWithValue }
  ) => {
    try {
      await removeWishlist({ userId, productId });
      return productId;
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to remove from wishlist"
      );
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: [], // productId[]
    fetchStatus: "idle",
    actionStatus: "idle", // add/remove status
    error: null,
  },

  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.fetchStatus = "idle";
      state.actionStatus = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= FETCH ================= */
      .addCase(fetchWishlist.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.fetchStatus = "idle";
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
      })

      /* ================= ADD ================= */
      .addCase(addWishlistItem.pending, (state, action) => {
        state.actionStatus = "loading";
        state.error = null;

        const productId = action.meta.arg.productId;

        // Optimistic update
        if (!state.items.includes(productId)) {
          state.items.push(productId);
        }
      })
      .addCase(addWishlistItem.fulfilled, (state) => {
        state.actionStatus = "idle";
      })
      .addCase(addWishlistItem.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;

        // Rollback optimistic update
        const productId = action.meta.arg.productId;
        state.items = state.items.filter(
          (id) => id !== productId
        );
      })

      /* ================= REMOVE ================= */
      .addCase(removeWishlistItem.pending, (state, action) => {
        state.actionStatus = "loading";
        state.error = null;

        // Optimistic removal
        const productId = action.meta.arg.productId;
        state.items = state.items.filter(
          (id) => id !== productId
        );
      })
      .addCase(removeWishlistItem.fulfilled, (state) => {
        state.actionStatus = "idle";
      })
      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload;

        // Rollback removal
        const productId = action.meta.arg.productId;
        if (!state.items.includes(productId)) {
          state.items.push(productId);
        }
      });
  },
});

/* =====================================================
   SELECTORS
===================================================== */

export const selectWishlistItems = (state) =>
  state.wishlist.items;

export const selectWishlistFetchStatus = (state) =>
  state.wishlist.fetchStatus;

export const selectWishlistActionStatus = (state) =>
  state.wishlist.actionStatus;

export const selectWishlistError = (state) =>
  state.wishlist.error;

/* =====================================================
   EXPORT
===================================================== */

export const { clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;