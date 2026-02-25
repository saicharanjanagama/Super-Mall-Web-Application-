// src/features/comparison/comparisonSlice.js
import { createSlice } from "@reduxjs/toolkit";

const MAX_COMPARE_ITEMS = 4;

const comparisonSlice = createSlice({
  name: "comparison",

  initialState: {
    items: [], // [{ id, name, price, imageUrl, ... }]
    max: MAX_COMPARE_ITEMS,
  },

  reducers: {
    /* =============================
       ADD TO COMPARE
    ============================== */
    addToCompare(state, action) {
      const product = action.payload;

      if (!product?.id) return;

      const exists = state.items.some((p) => p.id === product.id);
      if (exists) return;

      if (state.items.length >= state.max) {
        state.items.shift(); // remove oldest
      }

      state.items.push(product);
    },

    /* =============================
       TOGGLE COMPARE
       (Better UX)
    ============================== */
    toggleCompare(state, action) {
      const product = action.payload;

      if (!product?.id) return;

      const exists = state.items.find((p) => p.id === product.id);

      if (exists) {
        state.items = state.items.filter((p) => p.id !== product.id);
      } else {
        if (state.items.length >= state.max) {
          state.items.shift();
        }
        state.items.push(product);
      }
    },

    /* =============================
       REMOVE
    ============================== */
    removeFromCompare(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },

    /* =============================
       CLEAR
    ============================== */
    clearCompare(state) {
      state.items = [];
    },

    /* =============================
       SET MAX LIMIT (future use)
    ============================== */
    setCompareLimit(state, action) {
      const newLimit = action.payload;
      if (typeof newLimit === "number" && newLimit > 1) {
        state.max = newLimit;

        if (state.items.length > newLimit) {
          state.items = state.items.slice(-newLimit);
        }
      }
    },
  },
});

/* =============================
   EXPORT ACTIONS
============================= */

export const {
  addToCompare,
  toggleCompare,
  removeFromCompare,
  clearCompare,
  setCompareLimit,
} = comparisonSlice.actions;

/* =============================
   SELECTORS (Professional way)
============================= */

export const selectCompareItems = (state) => state.comparison.items;

export const selectCompareCount = (state) =>
  state.comparison.items.length;

export const isInCompare = (id) => (state) =>
  state.comparison.items.some((p) => p.id === id);

export default comparisonSlice.reducer;