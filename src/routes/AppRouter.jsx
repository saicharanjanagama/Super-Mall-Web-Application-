// src/routes/AppRouter.jsx

import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import { setUser } from "../features/auth/authSlice";
import { auth, firestore } from "../api/firebase";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/* ================= Layout ================= */

import Navbar from "../components/Layout/Navbar";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/Layout/DashboardLayout";

/* ================= Public Pages ================= */

import Home from "../views/Home";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import SearchResults from "../pages/SearchResults";
import ProductDetails from "../views/ProductDetails";
import ShopDetails from "../views/ShopDetails";
import ComparePage from "../features/comparison/ComparePage";
import WishlistPage from "../views/WishlistPage";
import CartPage from "../views/CartPage";

/* ================= Orders & Checkout ================= */

import Checkout from "../views/Checkout";
import OrderSummary from "../views/OrderSummary";
import OrderInvoice from "../views/OrderInvoice";
import OrderSuccess from "../views/OrderSuccess";
import OrdersPage from "../views/OrdersPage";

/* ================= Merchant Dashboard ================= */

import MerchantOverview from "../views/dashboard/MerchantOverview";
import ManageShops from "../views/dashboard/ManageShops";
import ManageProducts from "../views/dashboard/ManageProducts";
import ManageOffers from "../views/dashboard/ManageOffers";
import MerchantOrders from "../views/dashboard/MerchantOrders";

/* ================= Admin ================= */

import AdminDashboard from "../features/admin/AdminDashboard";
import AdminOrders from "../views/admin/AdminOrders";
import AdminOrderDetails from "../views/admin/AdminOrderDetails";

export default function AppRouter() {
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  /* ================= AUTH LISTENER ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const uid = fbUser.uid;

        try {
          // ✅ Modular Firestore v9
          const ref = doc(firestore, "users", uid);
          const snap = await getDoc(ref);

          const userDoc = snap.exists() ? snap.data() : {};

          dispatch(
            setUser({
              uid,
              email: fbUser.email,
              ...userDoc,
              verified: fbUser.emailVerified,
            })
          );
        } catch (err) {
          console.error("Failed to load user doc:", err);
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }

      setAuthReady(true);
    });

    return () => unsub();
  }, [dispatch]);

  if (!authReady) return null; // prevent flicker

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/shops/:shopId" element={<ShopDetails />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* ================= CUSTOMER ================= */}
        <Route
          element={
            <ProtectedRoute
              roles={["customer", "merchant", "admin"]}
            />
          }
        >
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/summary" element={<OrderSummary />} />
          <Route path="/invoice" element={<OrderInvoice />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Route>

        {/* ================= MERCHANT ================= */}
        <Route
          element={<ProtectedRoute roles={["merchant", "admin"]} />}
        >
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<MerchantOverview />} />
            <Route path="shops" element={<ManageShops />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="offers" element={<ManageOffers />} />
            <Route path="orders" element={<MerchantOrders />} />
          </Route>
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          element={<ProtectedRoute roles={["admin"]} />}
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
        </Route>

        {/* ================= 404 ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}