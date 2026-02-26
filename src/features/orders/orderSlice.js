// src/features/orders/orderSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrder as apiCreateOrder,
  getOrdersByUser,
  getAllOrders,
  getOrdersByMerchant,
  updateOrderStatus as apiUpdateOrderStatus,
} from "../../api/orders";
import { uploadPaymentProofToCloudinary } from "../../api/uploadPaymentProof";

/* =====================================================
   CREATE ORDER
===================================================== */
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ order, paymentProofFile }, { rejectWithValue }) => {
    try {
      const created = await apiCreateOrder(order);

      if (paymentProofFile) {
        const uploadResult =
          await uploadPaymentProofToCloudinary(paymentProofFile);

        await apiUpdateOrderStatus(created.id, {
          paymentProofUrl: uploadResult.url,
        });

        created.paymentProofUrl = uploadResult.url;
      }

      return created;
    } catch (err) {
      return rejectWithValue(
        err.message || "Order creation failed"
      );
    }
  }
);

/* =====================================================
   FETCH USER ORDERS
===================================================== */
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      return await getOrdersByUser(userId);
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch user orders"
      );
    }
  }
);

/* =====================================================
   FETCH ADMIN ORDERS
===================================================== */
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllOrders();
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch all orders"
      );
    }
  }
);

/* =====================================================
   FETCH MERCHANT ORDERS
===================================================== */
export const fetchOrdersByMerchant = createAsyncThunk(
  "orders/fetchOrdersByMerchant",
  async (merchantId, { rejectWithValue }) => {
    try {
      return await getOrdersByMerchant(merchantId);
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch merchant orders"
      );
    }
  }
);

/* =====================================================
   UPDATE ORDER STATUS
===================================================== */
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, updates }, { rejectWithValue }) => {
    try {
      await apiUpdateOrderStatus(orderId, updates);
      return { orderId, updates };
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to update order"
      );
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const slice = createSlice({
  name: "orders",

  initialState: {
    userOrders: [],
    merchantOrders: [],
    adminOrders: [],

    createStatus: "idle",
    fetchStatus: "idle",
    updateStatus: "idle",

    error: null,
  },

  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    /* ================= CREATE ================= */
    builder
      .addCase(createOrder.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createStatus = "idle";
        state.userOrders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error = action.payload;
      });

    /* ================= UPDATE ================= */
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatus = "loading";
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateStatus = "idle";

        const { orderId, updates } = action.payload;

        const updateList = (arr) =>
          arr.map((o) =>
            o.id === orderId ? { ...o, ...updates } : o
          );

        state.userOrders = updateList(state.userOrders);
        state.merchantOrders = updateList(state.merchantOrders);
        state.adminOrders = updateList(state.adminOrders);
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.error = action.payload;
      });

    /* ================= FETCH MATCHERS ================= */
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("orders/fetch") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.fetchStatus = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("orders/fetch") &&
          action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.fetchStatus = "idle";

          if (action.type.includes("fetchUserOrders")) {
            state.userOrders = action.payload ?? [];
          } else if (action.type.includes("fetchAllOrders")) {
            state.adminOrders = action.payload ?? [];
          } else if (
            action.type.includes("fetchOrdersByMerchant")
          ) {
            state.merchantOrders = action.payload ?? [];
          }
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("orders/fetch") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.fetchStatus = "failed";
          state.error = action.payload;
        }
      );
  },
});

/* =====================================================
   SELECTORS
===================================================== */

export const selectUserOrders = (state) =>
  state.orders.userOrders;

export const selectMerchantOrders = (state) =>
  state.orders.merchantOrders;

export const selectAdminOrders = (state) =>
  state.orders.adminOrders;

export const selectOrderCreateStatus = (state) =>
  state.orders.createStatus;

export const selectOrderFetchStatus = (state) =>
  state.orders.fetchStatus;

export const selectOrderUpdateStatus = (state) =>
  state.orders.updateStatus;

export const selectOrderError = (state) =>
  state.orders.error;

export const { clearOrderError } = slice.actions;

export default slice.reducer;