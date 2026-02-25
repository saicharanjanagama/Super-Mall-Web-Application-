// src/features/admin/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllUsers,
  fetchAllShops,
  updateShopApproval,
  fetchActivityLogs,
} from "../../api/admin";
import logger from "../../services/logger";

/* =====================================================
   THUNKS
===================================================== */

// Get all users
export const getUsers = createAsyncThunk(
  "admin/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllUsers();
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch users");
    }
  }
);

// Get all shops
export const getShopsAdmin = createAsyncThunk(
  "admin/getShopsAdmin",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllShops();
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch shops");
    }
  }
);

// Approve / Reject shop
export const setShopStatus = createAsyncThunk(
  "admin/setShopStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await updateShopApproval(id, status);

      await logger.info("ShopStatusChanged", {
        shopId: id,
        newStatus: status,
      });

      return { id, status };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update shop");
    }
  }
);

// Get activity logs
export const getLogs = createAsyncThunk(
  "admin/getLogs",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchActivityLogs();
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch logs");
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const adminSlice = createSlice({
  name: "admin",

  initialState: {
    users: [],
    shops: [],
    logs: [],

    usersStatus: "idle",
    shopsStatus: "idle",
    logsStatus: "idle",

    error: null,
  },

  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    /* ---------------- USERS ---------------- */
    builder
      .addCase(getUsers.pending, (state) => {
        state.usersStatus = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.usersStatus = "succeeded";
        state.users = action.payload || [];
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.usersStatus = "failed";
        state.error = action.payload;
      });

    /* ---------------- SHOPS ---------------- */
    builder
      .addCase(getShopsAdmin.pending, (state) => {
        state.shopsStatus = "loading";
      })
      .addCase(getShopsAdmin.fulfilled, (state, action) => {
        state.shopsStatus = "succeeded";
        state.shops = action.payload || [];
      })
      .addCase(getShopsAdmin.rejected, (state, action) => {
        state.shopsStatus = "failed";
        state.error = action.payload;
      });

    /* ---------------- UPDATE SHOP STATUS ---------------- */
    builder.addCase(setShopStatus.fulfilled, (state, action) => {
      const { id, status } = action.payload;

      state.shops = state.shops.map((shop) =>
        shop.id === id ? { ...shop, status } : shop
      );
    });

    builder.addCase(setShopStatus.rejected, (state, action) => {
      state.error = action.payload;
    });

    /* ---------------- LOGS ---------------- */
    builder
      .addCase(getLogs.pending, (state) => {
        state.logsStatus = "loading";
      })
      .addCase(getLogs.fulfilled, (state, action) => {
        state.logsStatus = "succeeded";
        state.logs = action.payload || [];
      })
      .addCase(getLogs.rejected, (state, action) => {
        state.logsStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;

export default adminSlice.reducer;