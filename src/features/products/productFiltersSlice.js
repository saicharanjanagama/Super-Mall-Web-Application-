// src/features/products/productFilterSlice.js

import { createSlice, createSelector } from "@reduxjs/toolkit";

/* =====================================================
   INITIAL STATE
===================================================== */

const initialState = {
  search: "",
  categories: [],        // multiple category support
  minPrice: 0,
  maxPrice: Infinity,
  minRating: 0,
  inStockOnly: false,
  sort: "newest",        // newest | price-asc | price-desc | name | rating
};

/* =====================================================
   SLICE
===================================================== */

const productFilterSlice = createSlice({
  name: "productFilters",
  initialState,

  reducers: {
    /* ================= SEARCH ================= */

    setSearch(state, action) {
      state.search = action.payload;
    },

    /* ================= CATEGORY ================= */

    // NEW: single category setter (for backward compatibility)
    setCategory(state, action) {
      const category = action.payload;
      state.categories = category ? [category] : [];
    },

    // multiple categories setter
    setCategories(state, action) {
      state.categories = action.payload || [];
    },

    toggleCategory(state, action) {
      const category = action.payload;
      const exists = state.categories.includes(category);

      if (exists) {
        state.categories = state.categories.filter(
          (c) => c !== category
        );
      } else {
        state.categories.push(category);
      }
    },

    /* ================= PRICE ================= */

    setMinPrice(state, action) {
      state.minPrice = Number(action.payload) || 0;
    },

    setMaxPrice(state, action) {
      state.maxPrice =
        action.payload === "" || action.payload === null
          ? Infinity
          : Number(action.payload);
    },

    /* ================= RATING ================= */

    setMinRating(state, action) {
      state.minRating = Number(action.payload) || 0;
    },

    /* ================= STOCK ================= */

    setInStockOnly(state, action) {
      state.inStockOnly = action.payload;
    },

    /* ================= SORT ================= */

    setSort(state, action) {
      state.sort = action.payload;
    },

    /* ================= RESET ================= */

    resetFilters() {
      return initialState;
    },
  },
});

/* =====================================================
   SELECTORS
===================================================== */

export const selectFilters = (state) =>
  state.productFilters;

export const selectFilteredProducts = createSelector(
  [(state) => state.products.products, selectFilters],
  (products, filters) => {
    if (!products) return [];

    let filtered = [...products];

    /* ========== SEARCH ========== */
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(term)
      );
    }

    /* ========== CATEGORY ========== */
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category)
      );
    }

    /* ========== PRICE ========== */
    filtered = filtered.filter(
      (p) =>
        p.price >= filters.minPrice &&
        p.price <= filters.maxPrice
    );

    /* ========== RATING ========== */
    if (filters.minRating > 0) {
      filtered = filtered.filter(
        (p) => (p.avgRating || 0) >= filters.minRating
      );
    }

    /* ========== STOCK ========== */
    if (filters.inStockOnly) {
      filtered = filtered.filter(
        (p) => (p.stock || 0) > 0
      );
    }

    /* ========== SORTING ========== */
    switch (filters.sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;

      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;

      case "name":
        filtered.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "rating":
        filtered.sort(
          (a, b) => (b.avgRating || 0) - (a.avgRating || 0)
        );
        break;

      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            (b.createdAt?.seconds || 0) -
            (a.createdAt?.seconds || 0)
        );
        break;
    }

    return filtered;
  }
);

/* =====================================================
   EXPORT
===================================================== */

export const {
  setSearch,
  setCategory,      // ✅ now exists
  setCategories,
  toggleCategory,
  setMinPrice,
  setMaxPrice,
  setMinRating,
  setInStockOnly,
  setSort,
  resetFilters,
} = productFilterSlice.actions;

export default productFilterSlice.reducer;