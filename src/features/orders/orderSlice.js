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
        const url = await uploadPaymentProofToCloudinary(
          paymentProofFile
        );

        await apiUpdateOrderStatus(created.id, {
          paymentProofUrl: url,
        });

        created.paymentProofUrl = url;
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
    status: "idle", // idle | loading | creating | updating | failed
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
        state.status = "creating";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "idle";
        state.userOrders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= FETCH USER ================= */
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = "idle";
        state.userOrders = action.payload || [];
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= FETCH ADMIN ================= */
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = "idle";
        state.adminOrders = action.payload || [];
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= FETCH MERCHANT ================= */
    builder
      .addCase(fetchOrdersByMerchant.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrdersByMerchant.fulfilled, (state, action) => {
        state.status = "idle";
        state.merchantOrders = action.payload || [];
      })
      .addCase(fetchOrdersByMerchant.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= UPDATE STATUS ================= */
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = "updating";
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = "idle";

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
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

/* =====================================================
   SELECTORS (Professional Way)
===================================================== */

export const selectUserOrders = (state) =>
  state.orders.userOrders;

export const selectMerchantOrders = (state) =>
  state.orders.merchantOrders;

export const selectAdminOrders = (state) =>
  state.orders.adminOrders;

export const selectOrderStatus = (state) =>
  state.orders.status;

export const selectOrderError = (state) =>
  state.orders.error;

/* =====================================================
   EXPORT
===================================================== */

export const { clearOrderError } = slice.actions;
export default slice.reducer;