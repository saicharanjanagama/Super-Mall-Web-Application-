// src/components/Layout/DashboardLayout.jsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/* =============================== STYLES =============================== */

const Layout = styled.div`
  display: flex;
  min-height: calc(100vh - 60px);
  background: ${({ theme }) => theme.colors.background};
`;

const Overlay = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 998;
  }
`;

const Sidebar = styled.aside`
  width: 260px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 30px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: 0.3s ease;

  @media (max-width: 900px) {
    position: fixed;
    left: ${({ $open }) => ($open ? "0" : "-260px")};
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 999;
  }
`;

const SidebarTitle = styled.h3`
  margin-bottom: 30px;
  font-weight: 700;
`;

const MenuItem = styled(NavLink)`
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 12px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  transition: 0.25s;

  &:hover {
    background: rgba(79, 70, 229, 0.08);
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ToggleBtn = styled.button`
  display: none;

  @media (max-width: 900px) {
    display: block;
    position: fixed;
    top: 70px;
    left: 15px;
    z-index: 1000;
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
  }
`;

/* =============================== COMPONENT =============================== */

export default function DashboardLayout() {
  const user = useSelector((s) => s.auth?.user || null);
  const role = user?.role || "user";

  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <Layout>
      <ToggleBtn onClick={() => setOpen((prev) => !prev)}>
        ☰
      </ToggleBtn>

      <Overlay $open={open} onClick={() => setOpen(false)} />

      <Sidebar $open={open}>
        <SidebarTitle>
          {role === "admin"
            ? "Admin Dashboard"
            : "Merchant Dashboard"}
        </SidebarTitle>

        {(role === "merchant" || role === "admin") && (
          <>
            <MenuItem to="/dashboard">Overview</MenuItem>
            <MenuItem to="/dashboard/shops">Manage Shops</MenuItem>
            <MenuItem to="/dashboard/products">Manage Products</MenuItem>
            <MenuItem to="/dashboard/offers">Manage Offers</MenuItem>
            <MenuItem to="/dashboard/orders">Orders</MenuItem>
          </>
        )}

        {role === "admin" && (
          <>
            <MenuItem to="/admin">Admin Panel</MenuItem>
            <MenuItem to="/admin/orders">All Orders</MenuItem>
          </>
        )}
      </Sidebar>

      {/* 🔥 THIS FIXES EVERYTHING */}
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}