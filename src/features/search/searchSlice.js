// src/features/search/searchSlice.js

import {
  createSlice,
  createAsyncThunk,
  createSelector
} from "@reduxjs/toolkit";

import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";

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

      /* ================= PRODUCTS ================= */
      const prodSnap = await getDocs(
        collection(db, "products")
      );

      prodSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const name = data.name?.toLowerCase() || "";
        const category = data.category?.toLowerCase() || "";

        if (name.includes(q) || category.includes(q)) {
          results.push({
            id: `product-${docSnap.id}`,
            entityId: docSnap.id,
            title: data.name,
            image: data.imageUrl || null,
            type: "product",
            link: `/product/${docSnap.id}`,
            raw: { id: docSnap.id, ...data },
            score: name.startsWith(q) ? 3 : 1
          });
        }
      });

      /* ================= SHOPS ================= */
      const shopSnap = await getDocs(
        collection(db, "shops")
      );

      shopSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const name = data.name?.toLowerCase() || "";
        const category = data.category?.toLowerCase() || "";

        if (name.includes(q) || category.includes(q)) {
          results.push({
            id: `shop-${docSnap.id}`,
            entityId: docSnap.id,
            title: data.name,
            image: data.imageUrl || null,
            type: "shop",
            link: `/shops/${docSnap.id}`,
            raw: { id: docSnap.id, ...data },
            score: name.startsWith(q) ? 2 : 1
          });
        }
      });

      /* ================= OFFERS ================= */
      const offerSnap = await getDocs(
        collection(db, "offers")
      );

      offerSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const title = data.title?.toLowerCase() || "";

        if (title.includes(q)) {
          results.push({
            id: `offer-${docSnap.id}`,
            entityId: docSnap.id,
            title: data.title,
            image: null,
            type: "offer",
            link: `/shops/${data.shopId}`,
            raw: { id: docSnap.id, ...data },
            score: title.startsWith(q) ? 2 : 1
          });
        }
      });

      results.sort((a, b) => b.score - a.score);

      return results;
    } catch (err) {
      return rejectWithValue(
        err.message || "Search failed"
      );
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
    status: "idle",
    error: null,

    minPrice: 0,
    maxPrice: Infinity,
    category: "",
    minRating: 0,
    sortBy: "relevance"
  },

  reducers: {
    setQuery(state, action) {
      state.query = action.payload ?? "";
    },

    setFilters(state, action) {
      const {
        minPrice,
        maxPrice,
        category,
        minRating
      } = action.payload;

      if (minPrice !== undefined)
        state.minPrice = Number(minPrice) || 0;

      if (maxPrice !== undefined)
        state.maxPrice =
          maxPrice === ""
            ? Infinity
            : Number(maxPrice);

      if (category !== undefined)
        state.category = category;

      if (minRating !== undefined)
        state.minRating = Number(minRating) || 0;
    },

    setSort(state, action) {
      state.sortBy = action.payload || "relevance";
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
   SELECTOR
===================================================== */

export const selectFilteredSearchResults = createSelector(
  [(state) => state.search],
  (search) => {
    let items = [...search.results];

    items = items.filter((item) => {
      if (item.type !== "product") return true;

      const raw = item.raw || {};
      const price = Number(raw.price) || 0;
      const rating = Number(raw.avgRating) || 0;

      return (
        price >= search.minPrice &&
        price <= search.maxPrice &&
        (search.category
          ? raw.category === search.category
          : true) &&
        rating >= search.minRating
      );
    });

    switch (search.sortBy) {
      case "price-asc":
        items.sort(
          (a, b) =>
            (a.raw?.price || 0) -
            (b.raw?.price || 0)
        );
        break;

      case "price-desc":
        items.sort(
          (a, b) =>
            (b.raw?.price || 0) -
            (a.raw?.price || 0)
        );
        break;

      case "rating":
        items.sort(
          (a, b) =>
            (b.raw?.avgRating || 0) -
            (a.raw?.avgRating || 0)
        );
        break;

      default:
        items.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
    }

    return items;
  }
);

export const {
  setQuery,
  setFilters,
  setSort,
  clearSearch
} = searchSlice.actions;

export default searchSlice.reducer;