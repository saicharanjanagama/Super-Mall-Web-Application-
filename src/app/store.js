// src/app/store.js

import { configureStore } from "@reduxjs/toolkit";

/* ===============================
   FEATURE REDUCERS
================================= */
import authReducer from "../features/auth/authSlice";
import shopReducer from "../features/shops/shopSlice";
import productReducer from "../features/products/productSlice";
import adminReducer from "../features/admin/adminSlice";
import comparisonReducer from "../features/comparison/comparisonSlice";
import productFiltersReducer from "../features/products/productFiltersSlice";
import reviewReducer from "../features/reviews/reviewSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import offersReducer from "../features/offers/offerSlice";
import searchReducer from "../features/search/searchSlice";
import cartReducer from "../features/cart/cartSlice";
import ordersReducer from "../features/orders/orderSlice";

/* ===============================
   STORE CONFIGURATION
================================= */

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shops: shopReducer,
    products: productReducer,
    admin: adminReducer,
    comparison: comparisonReducer,
    productFilters: productFiltersReducer,
    reviews: reviewReducer,
    wishlist: wishlistReducer,
    offers: offersReducer,
    search: searchReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Firestore timestamps & File objects
        ignoredActions: ["orders/createOrder/fulfilled"],
        ignoredPaths: [
          "orders.list",
          "products.products",
        ],
      },
    }),

  devTools: process.env.NODE_ENV !== "production",
});

/* ===============================
   TYPED HELPERS (Recommended)
================================= */

// If using JS only, these are optional
export const getState = store.getState;
export const dispatch = store.dispatch;

export default store;