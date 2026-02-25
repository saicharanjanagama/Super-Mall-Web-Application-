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

export const addWishlistItem =
  createAsyncThunk(
    "wishlist/add",
    async (
      { userId, productId },
      { rejectWithValue }
    ) => {
      try {
        await addWishlist({
          userId,
          productId,
        });
        return productId;
      } catch (err) {
        return rejectWithValue(
          err.message ||
            "Failed to add to wishlist"
        );
      }
    }
  );

/* =====================================================
   REMOVE ITEM
===================================================== */

export const removeWishlistItem =
  createAsyncThunk(
    "wishlist/remove",
    async (
      { userId, productId },
      { rejectWithValue }
    ) => {
      try {
        await removeWishlist({
          userId,
          productId,
        });
        return productId;
      } catch (err) {
        return rejectWithValue(
          err.message ||
            "Failed to remove from wishlist"
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
    status: "idle", // idle | loading | failed
    error: null,
  },

  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    /* ================= FETCH ================= */
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchWishlist.fulfilled,
        (state, action) => {
          state.status = "idle";
          state.items = action.payload || [];
        }
      )
      .addCase(
        fetchWishlist.rejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );

    /* ================= ADD ================= */
    builder
      .addCase(
        addWishlistItem.pending,
        (state, action) => {
          state.error = null;

          // optimistic update
          const productId =
            action.meta.arg.productId;

          if (
            !state.items.includes(productId)
          ) {
            state.items.push(productId);
          }
        }
      )
      .addCase(
        addWishlistItem.rejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );

    /* ================= REMOVE ================= */
    builder
      .addCase(
        removeWishlistItem.pending,
        (state, action) => {
          state.error = null;

          // optimistic removal
          const productId =
            action.meta.arg.productId;

          state.items = state.items.filter(
            (id) => id !== productId
          );
        }
      )
      .addCase(
        removeWishlistItem.rejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

/* =====================================================
   SELECTORS
===================================================== */

export const selectWishlistItems = (state) =>
  state.wishlist.items;

export const selectWishlistStatus = (state) =>
  state.wishlist.status;

export const selectWishlistError = (state) =>
  state.wishlist.error;

/* =====================================================
   EXPORT
===================================================== */

export const { clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;