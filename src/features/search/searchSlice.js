// src/features/search/searchSlice.js

import {
  createSlice,
  createAsyncThunk,
  createSelector
} from "@reduxjs/toolkit";
import { firestore } from "../../api/firebase";

/* =====================================================
   GLOBAL SEARCH
===================================================== */

export const globalSearch = createAsyncThunk(
  "search/globalSearch",
  async (query, { rejectWithValue }) => {
    try {
      if (!query?.trim()) return [];

      const q = query.toLowerCase().trim();
      const results = [];
      const seenIds = new Set(); // prevent duplicates

      /* ================= PRODUCTS ================= */
      const prodSnap = await firestore.collection("products").get();

      prodSnap.forEach((doc) => {
        const data = doc.data();
        const name = data.name?.toLowerCase() || "";
        const category = data.category?.toLowerCase() || "";

        if (name.includes(q) || category.includes(q)) {
          if (!seenIds.has(doc.id)) {
            seenIds.add(doc.id);

            results.push({
              id: doc.id,
              title: data.name,
              image: data.imageUrl || null,
              type: "product",
              link: `/product/${doc.id}`,
              raw: { id: doc.id, ...data },
              score: name.startsWith(q) ? 2 : 1 // basic relevance
            });
          }
        }
      });

      /* ================= SHOPS ================= */
      const shopSnap = await firestore.collection("shops").get();

      shopSnap.forEach((doc) => {
        const data = doc.data();
        const name = data.name?.toLowerCase() || "";
        const category = data.category?.toLowerCase() || "";

        if (name.includes(q) || category.includes(q)) {
          if (!seenIds.has(doc.id)) {
            seenIds.add(doc.id);

            results.push({
              id: doc.id,
              title: data.name,
              image: data.imageUrl || null,
              type: "shop",
              link: `/shops/${doc.id}`,
              raw: { id: doc.id, ...data },
              score: name.startsWith(q) ? 2 : 1
            });
          }
        }
      });

      /* ================= OFFERS ================= */
      const offerSnap = await firestore.collection("offers").get();

      offerSnap.forEach((doc) => {
        const data = doc.data();
        const title = data.title?.toLowerCase() || "";

        if (title.includes(q)) {
          if (!seenIds.has(doc.id)) {
            seenIds.add(doc.id);

            results.push({
              id: doc.id,
              title: data.title,
              image: null,
              type: "offer",
              link: `/shops/${data.shopId}`,
              raw: { id: doc.id, ...data },
              score: title.startsWith(q) ? 2 : 1
            });
          }
        }
      });

      // Default relevance sort
      results.sort((a, b) => b.score - a.score);

      return results;
    } catch (err) {
      return rejectWithValue(err.message || "Search failed");
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const searchSlice = createSlice({
  name: "search",

  initialState: {
    query: "",
    results: [],
    status: "idle", // idle | loading | failed
    error: null,

    // filters
    minPrice: 0,
    maxPrice: Infinity,
    category: "",
    minRating: 0,
    sortBy: "relevance"
  },

  reducers: {
    setQuery(state, action) {
      state.query = action.payload;
    },

    setFilters(state, action) {
      const { minPrice, maxPrice, category, minRating } =
        action.payload;

      if (minPrice !== undefined)
        state.minPrice = Number(minPrice);

      if (maxPrice !== undefined)
        state.maxPrice =
          maxPrice === "" ? Infinity : Number(maxPrice);

      if (category !== undefined)
        state.category = category;

      if (minRating !== undefined)
        state.minRating = Number(minRating);
    },

    setSort(state, action) {
      state.sortBy = action.payload;
    },

    clearSearch(state) {
      state.results = [];
      state.query = "";
      state.status = "idle";
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(globalSearch.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.query = action.meta.arg;
      })
      .addCase(globalSearch.fulfilled, (state, action) => {
        state.status = "idle";
        state.results = action.payload || [];
      })
      .addCase(globalSearch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

/* =====================================================
   MEMOIZED FILTERED SELECTOR
===================================================== */

export const selectFilteredSearchResults = createSelector(
  [(state) => state.search],
  (search) => {
    let items = [...search.results];

    /* ================= FILTER ================= */
    items = items.filter((item) => {
      const raw = item.raw || {};
      const price = raw.price ?? 0;
      const rating = raw.avgRating ?? 0;

      return (
        price >= search.minPrice &&
        price <= search.maxPrice &&
        (search.category
          ? raw.category === search.category
          : true) &&
        rating >= search.minRating
      );
    });

    /* ================= SORT ================= */
    switch (search.sortBy) {
      case "price-asc":
        items.sort(
          (a, b) => (a.raw.price || 0) - (b.raw.price || 0)
        );
        break;

      case "price-desc":
        items.sort(
          (a, b) => (b.raw.price || 0) - (a.raw.price || 0)
        );
        break;

      case "rating":
        items.sort(
          (a, b) =>
            (b.raw.avgRating || 0) -
            (a.raw.avgRating || 0)
        );
        break;

      case "relevance":
      default:
        items.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
    }

    return items;
  }
);

/* =====================================================
   EXPORTS
===================================================== */

export const {
  setQuery,
  setFilters,
  setSort,
  clearSearch
} = searchSlice.actions;

export default searchSlice.reducer;