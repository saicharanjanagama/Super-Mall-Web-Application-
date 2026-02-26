// src/features/products/productFilterSlice.js

import { createSlice, createSelector } from "@reduxjs/toolkit";

/* =====================================================
   INITIAL STATE
===================================================== */

const initialState = {
  search: "",
  categories: [],
  minPrice: 0,
  maxPrice: Infinity,
  minRating: 0,
  inStockOnly: false,
  sort: "newest", // newest | price-asc | price-desc | name | rating
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
      state.search = action.payload ?? "";
    },

    /* ================= CATEGORY ================= */

    setCategory(state, action) {
      const category = action.payload;
      state.categories = category ? [category] : [];
    },

    setCategories(state, action) {
      state.categories = Array.isArray(action.payload)
        ? action.payload
        : [];
    },

    toggleCategory(state, action) {
      const category = action.payload;
      if (!category) return;

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
      state.minPrice = Math.max(
        0,
        Number(action.payload) || 0
      );
    },

    setMaxPrice(state, action) {
      if (
        action.payload === "" ||
        action.payload === null
      ) {
        state.maxPrice = Infinity;
      } else {
        const value = Number(action.payload);
        state.maxPrice =
          Number.isFinite(value) && value > 0
            ? value
            : Infinity;
      }
    },

    /* ================= RATING ================= */

    setMinRating(state, action) {
      state.minRating = Math.max(
        0,
        Number(action.payload) || 0
      );
    },

    /* ================= STOCK ================= */

    setInStockOnly(state, action) {
      state.inStockOnly = Boolean(action.payload);
    },

    /* ================= SORT ================= */

    setSort(state, action) {
      state.sort = action.payload || "newest";
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

/* =====================================================
   FILTERED PRODUCTS SELECTOR
===================================================== */

export const selectFilteredProducts = createSelector(
  [(state) => state.products.products, selectFilters],
  (products, filters) => {
    if (!Array.isArray(products)) return [];

    let filtered = [...products];

    /* ========== SEARCH ========== */
    if (filters.search) {
      const term = filters.search
        .toLowerCase()
        .trim();

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
    filtered = filtered.filter((p) => {
      const price = Number(p.price) || 0;
      return (
        price >= filters.minPrice &&
        price <= filters.maxPrice
      );
    });

    /* ========== RATING ========== */
    if (filters.minRating > 0) {
      filtered = filtered.filter(
        (p) =>
          (Number(p.avgRating) || 0) >=
          filters.minRating
      );
    }

    /* ========== STOCK ========== */
    if (filters.inStockOnly) {
      filtered = filtered.filter(
        (p) => (Number(p.stock) || 0) > 0
      );
    }

    /* ========== SORTING ========== */

    const getCreatedAtValue = (product) => {
      const value = product.createdAt;

      if (!value) return 0;

      // If ISO string
      if (typeof value === "string") {
        return new Date(value).getTime() || 0;
      }

      // If numeric timestamp
      if (typeof value === "number") {
        return value;
      }

      return 0;
    };

    switch (filters.sort) {
      case "price-asc":
        filtered.sort(
          (a, b) =>
            (Number(a.price) || 0) -
            (Number(b.price) || 0)
        );
        break;

      case "price-desc":
        filtered.sort(
          (a, b) =>
            (Number(b.price) || 0) -
            (Number(a.price) || 0)
        );
        break;

      case "name":
        filtered.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "rating":
        filtered.sort(
          (a, b) =>
            (Number(b.avgRating) || 0) -
            (Number(a.avgRating) || 0)
        );
        break;

      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            getCreatedAtValue(b) -
            getCreatedAtValue(a)
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
  setCategory,
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