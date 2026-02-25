// src/features/products/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from "../../api/products";
import { uploadToCloudinary } from "../../api/cloudinary";
import logger from "../../services/logger";

/* =====================================================
   ADD PRODUCT
===================================================== */
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async ({ data, file }, { rejectWithValue }) => {
    try {
      let imageUrl = data.imageUrl || "";

      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }

      const created = await createProduct({
        ...data,
        imageUrl,
      });

      await logger?.info?.("ProductCreated", created).catch(() => {});

      return created;
    } catch (err) {
      return rejectWithValue(
        err.message || "Product creation failed"
      );
    }
  }
);

/* =====================================================
   FETCH PRODUCTS
===================================================== */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (shopId = null, { rejectWithValue }) => {
    try {
      const products = await getProducts(shopId);
      return { products: products || [], shopId };
    } catch (err) {
      return rejectWithValue(
        err.message || "Failed to fetch products"
      );
    }
  }
);

/* =====================================================
   EDIT PRODUCT
===================================================== */
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, updates, file }, { rejectWithValue }) => {
    try {
      let imageUrl = updates.imageUrl || "";

      if (file) {
        imageUrl = await uploadToCloudinary(file);
      }

      const finalData = {
        ...updates,
        imageUrl,
      };

      await updateProduct(id, finalData);

      await logger?.info?.("ProductUpdated", {
        id,
        finalData,
      }).catch(() => {});

      return { id, updates: finalData };
    } catch (err) {
      return rejectWithValue(
        err.message || "Product update failed"
      );
    }
  }
);

/* =====================================================
   DELETE PRODUCT
===================================================== */
export const removeProduct = createAsyncThunk(
  "products/removeProduct",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProduct(id);

      await logger?.info?.("ProductDeleted", {
        id,
      }).catch(() => {});

      return id;
    } catch (err) {
      return rejectWithValue(
        err.message || "Product deletion failed"
      );
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const productSlice = createSlice({
  name: "products",

  initialState: {
    products: [],
    status: "idle", // idle | loading | creating | updating | deleting | failed
    error: null,
    editingProduct: null,
  },

  reducers: {
    setEditingProduct(state, action) {
      state.editingProduct = action.payload;
    },

    clearProductError(state) {
      state.error = null;
    },

    resetProducts(state) {
      state.products = [];
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    /* ================= FETCH ================= */
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload.products || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= ADD ================= */
    builder
      .addCase(addProduct.pending, (state) => {
        state.status = "creating";
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = "idle";

        // prevent duplicates
        const exists = state.products.find(
          (p) => p.id === action.payload.id
        );

        if (!exists) {
          state.products.unshift(action.payload);
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= EDIT ================= */
    builder
      .addCase(editProduct.pending, (state) => {
        state.status = "updating";
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.status = "idle";

        const { id, updates } = action.payload;

        state.products = state.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        );

        state.editingProduct = null;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    /* ================= DELETE ================= */
    builder
      .addCase(removeProduct.pending, (state) => {
        state.status = "deleting";
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = state.products.filter(
          (p) => p.id !== action.payload
        );
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

/* =====================================================
   SELECTORS
===================================================== */

export const selectAllProducts = (state) =>
  state.products.products;

export const selectProductStatus = (state) =>
  state.products.status;

export const selectProductError = (state) =>
  state.products.error;

export const selectEditingProduct = (state) =>
  state.products.editingProduct;

/* =====================================================
   EXPORT
===================================================== */

export const {
  setEditingProduct,
  resetProducts,
  clearProductError,
} = productSlice.actions;

export default productSlice.reducer;