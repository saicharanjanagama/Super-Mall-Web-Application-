// src/features/comparison/comparisonSlice.js

import { createSlice } from "@reduxjs/toolkit";

const MAX_COMPARE_ITEMS = 4;

/* =====================================================
   Helper → Normalize Product (Prevent Large State)
===================================================== */

function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category,
  };
}

const comparisonSlice = createSlice({
  name: "comparison",

  initialState: {
    items: [],
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
        state.items.shift();
      }

      state.items.push(normalizeProduct(product));
    },

    /* =============================
       TOGGLE COMPARE
    ============================== */
    toggleCompare(state, action) {
      const product = action.payload;
      if (!product?.id) return;

      const index = state.items.findIndex(
        (p) => p.id === product.id
      );

      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        if (state.items.length >= state.max) {
          state.items.shift();
        }

        state.items.push(normalizeProduct(product));
      }
    },

    /* =============================
       REMOVE
    ============================== */
    removeFromCompare(state, action) {
      const id = action.payload;
      state.items = state.items.filter((p) => p.id !== id);
    },

    /* =============================
       CLEAR
    ============================== */
    clearCompare(state) {
      state.items = [];
    },

    /* =============================
       SET MAX LIMIT
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

/* =====================================================
   EXPORT ACTIONS
===================================================== */

export const {
  addToCompare,
  toggleCompare,
  removeFromCompare,
  clearCompare,
  setCompareLimit,
} = comparisonSlice.actions;

/* =====================================================
   SELECTORS
===================================================== */

export const selectCompareItems = (state) =>
  state.comparison.items;

export const selectCompareCount = (state) =>
  state.comparison.items.length;

export const selectCompareLimit = (state) =>
  state.comparison.max;

export const isInCompare =
  (id) =>
  (state) =>
    state.comparison.items.some((p) => p.id === id);

export default comparisonSlice.reducer;