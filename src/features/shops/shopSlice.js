// src/features/shops/shopSlice.js

import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

import {
  createShop,
  getShops,
  updateShop,
  deleteShop,
} from "../../api/shops";

import logger from "../../services/logger";

/* =====================================================
   CREATE SHOP
===================================================== */
export const addShop = createAsyncThunk(
  "shops/addShop",
  async (shopData, { rejectWithValue }) => {
    try {
      const docRef = await createShop(shopData);

      const createdShop = {
        id: docRef.id,
        ...shopData,
      };

      await logger?.info?.(
        "ShopCreated",
        createdShop
      ).catch(() => {});

      return createdShop;
    } catch (err) {
      return rejectWithValue(
        err.message || "Shop creation failed"
      );
    }
  }
);

/* =====================================================
   FETCH SHOPS
===================================================== */
export const fetchShops = createAsyncThunk(
  "shops/fetchShops",
  async (_, { rejectWithValue }) => {
    try {
      return await getShops();
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch shops"
      );
    }
  }
);

/* =====================================================
   UPDATE SHOP
===================================================== */
export const editShop = createAsyncThunk(
  "shops/editShop",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      await updateShop(id, updates);

      await logger?.info?.(
        "ShopUpdated",
        { id, updates }
      ).catch(() => {});

      return { id, updates };
    } catch (err) {
      return rejectWithValue(
        err.message || "Shop update failed"
      );
    }
  }
);

/* =====================================================
   DELETE SHOP
===================================================== */
export const removeShop = createAsyncThunk(
  "shops/removeShop",
  async (id, { rejectWithValue }) => {
    try {
      await deleteShop(id);

      await logger?.info?.(
        "ShopDeleted",
        { id }
      ).catch(() => {});

      return id;
    } catch (err) {
      return rejectWithValue(
        err.message || "Shop deletion failed"
      );
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const shopSlice = createSlice({
  name: "shops",

  initialState: {
    shops: [],

    fetchStatus: "idle",
    createStatus: "idle",
    updateStatus: "idle",
    deleteStatus: "idle",

    error: null,
    editingShop: null,

    filters: {
      category: "",
      floor: "",
      search: "",
    },
  },

  reducers: {
    setEditingShop(state, action) {
      state.editingShop = action.payload;
    },

    setShopFilters(state, action) {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    clearShopError(state) {
      state.error = null;
    },

    resetShops(state) {
      state.shops = [];
      state.fetchStatus = "idle";
      state.createStatus = "idle";
      state.updateStatus = "idle";
      state.deleteStatus = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    /* ================= FETCH ================= */
    builder
      .addCase(fetchShops.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = null;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.fetchStatus = "idle";
        state.shops = action.payload ?? [];
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
      });

    /* ================= CREATE ================= */
    builder
      .addCase(addShop.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(addShop.fulfilled, (state, action) => {
        state.createStatus = "idle";

        const exists = state.shops.find(
          (s) => s.id === action.payload.id
        );

        if (!exists) {
          state.shops.unshift(action.payload);
        }
      })
      .addCase(addShop.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload;
      });

    /* ================= UPDATE ================= */
    builder
      .addCase(editShop.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(editShop.fulfilled, (state, action) => {
        state.updateStatus = "idle";

        const { id, updates } = action.payload;

        state.shops = state.shops.map((shop) =>
          shop.id === id
            ? { ...shop, ...updates }
            : shop
        );

        state.editingShop = null;
      })
      .addCase(editShop.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      });

    /* ================= DELETE ================= */
    builder
      .addCase(removeShop.pending, (state) => {
        state.deleteStatus = "loading";
        state.error = null;
      })
      .addCase(removeShop.fulfilled, (state, action) => {
        state.deleteStatus = "idle";
        state.shops = state.shops.filter(
          (shop) => shop.id !== action.payload
        );
      })
      .addCase(removeShop.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload;
      });
  },
});

/* =====================================================
   SELECTORS
===================================================== */

export const selectAllShops = (state) =>
  state.shops.shops;

export const selectShopFilters = (state) =>
  state.shops.filters;

export const selectShopStatus = (state) => ({
  fetch: state.shops.fetchStatus,
  create: state.shops.createStatus,
  update: state.shops.updateStatus,
  delete: state.shops.deleteStatus,
});

export const selectShopError = (state) =>
  state.shops.error;

export const selectFilteredShops = createSelector(
  [
    (state) => state.shops.shops,
    (state) => state.shops.filters,
  ],
  (shops, filters) => {
    let filtered = [...shops];

    if (filters.category) {
      filtered = filtered.filter(
        (s) => s.category === filters.category
      );
    }

    if (filters.floor) {
      filtered = filtered.filter(
        (s) => s.floor === filters.floor
      );
    }

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter((s) =>
        s.name?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }
);

/* =====================================================
   EXPORT
===================================================== */

export const {
  setEditingShop,
  setShopFilters,
  clearShopError,
  resetShops,
} = shopSlice.actions;

export default shopSlice.reducer;