// src/routes/ProtectedRoute.jsx

import React from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

export default function ProtectedRoute({
  children,
  roles,
  requireVerified = false,
}) {
  const { user, initialized } =
    useSelector((s) => s.auth);

  const location = useLocation();

  /* ================= WAIT FOR AUTH ================= */
  if (!initialized) {
    return null; // prevents flicker
  }

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /* ================= ROLE CHECK ================= */
  if (
    roles &&
    !roles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /* ================= EMAIL VERIFICATION ================= */
  if (
    requireVerified &&
    !user.verified
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* ================= RENDER ================= */

  // If used as wrapper route (nested)
  if (!children) {
    return <Outlet />;
  }

  // If used as direct wrapper
  return children;
}