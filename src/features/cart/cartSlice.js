// src/features/cart/cartSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../api/firebase";

/* =====================================================
   FIRESTORE HELPERS (MODULAR)
===================================================== */

async function saveCartToFirestore(userId, items) {
  if (!userId) return;

  await setDoc(
    doc(db, "carts", userId),
    {
      items,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function loadFromFirestore(userId) {
  if (!userId) return [];

  const snap = await getDoc(doc(db, "carts", userId));

  if (!snap.exists()) return [];

  return snap.data().items || [];
}

/* =====================================================
   THUNKS
===================================================== */

export const loadCart = createAsyncThunk(
  "cart/loadCart",
  async (userId, { rejectWithValue }) => {
    try {
      return await loadFromFirestore(userId);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load cart");
    }
  }
);

export const syncCart = createAsyncThunk(
  "cart/syncCart",
  async ({ userId, items }, { rejectWithValue }) => {
    try {
      await saveCartToFirestore(userId, items);
      return items;
    } catch (err) {
      return rejectWithValue(err.message || "Cart sync failed");
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [],
    status: "idle", // idle | loading | syncing | failed
    error: null,
  },

  reducers: {
    /* ---------------- ADD ---------------- */
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((p) => p.id === product.id);

      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        state.items.push({ ...product, qty: 1 });
      }
    },

    /* ---------------- REMOVE ---------------- */
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },

    /* ---------------- INCREASE ---------------- */
    increaseQty(state, action) {
      const id = action.payload;
      const item = state.items.find((p) => p.id === id);
      if (item) item.qty += 1;
    },

    /* ---------------- DECREASE ---------------- */
    decreaseQty(state, action) {
      const id = action.payload;
      const item = state.items.find((p) => p.id === id);

      if (!item) return;

      if (item.qty > 1) {
        item.qty -= 1;
      } else {
        state.items = state.items.filter((x) => x.id !== id);
      }
    },

    /* ---------------- CLEAR ---------------- */
    clearCart(state) {
      state.items = [];
    },

    /* ---------------- RESET ERROR ---------------- */
    clearCartError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* -------- LOAD CART -------- */
      .addCase(loadCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload ?? [];
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      /* -------- SYNC CART -------- */
      .addCase(syncCart.pending, (state) => {
        state.status = "syncing";
        state.error = null;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.status = "idle";
        state.items = action.payload ?? [];
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  clearCartError,
} = cartSlice.actions;

export default cartSlice.reducer;