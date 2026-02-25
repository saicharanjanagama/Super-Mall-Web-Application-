// src/components/Layout/DashboardLayout.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

/* ===============================
   MAIN LAYOUT
================================ */
const Layout = styled.div`
  display: flex;
  min-height: calc(100vh - 60px);
  background: ${({ theme }) => theme.colors.background};
`;

/* ===============================
   SIDEBAR
================================ */
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
    left: ${({ open }) => (open ? "0" : "-260px")};
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 999;
  }
`;

const SidebarTitle = styled.h3`
  margin-bottom: 30px;
  font-weight: 700;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
`;

/* ===============================
   MENU ITEM
================================ */
const MenuItem = styled(NavLink)`
  position: relative;
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 12px;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  transition: all 0.25s ease;

  &:hover {
    background: rgba(79, 70, 229, 0.08);
    transform: translateX(4px);
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    font-weight: 600;
  }

  &.active::before {
    content: "";
    position: absolute;
    left: -10px;
    top: 8px;
    bottom: 8px;
    width: 4px;
    border-radius: 6px;
    background: white;
  }
`;

/* ===============================
   CONTENT AREA
================================ */
const Content = styled.main`
  flex: 1;
  padding: 40px;
  transition: 0.3s ease;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

/* ===============================
   MOBILE TOGGLE BUTTON
================================ */
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

/* ===============================
   COMPONENT
================================ */
export default function DashboardLayout({ children }) {
  const user = useSelector((s) => s.auth?.user || null);
  const role = user?.role || "user";

  const [open, setOpen] = useState(false);

  return (
    <Layout>
      <ToggleBtn onClick={() => setOpen(!open)}>
        ☰
      </ToggleBtn>

      <Sidebar open={open}>
        <SidebarTitle>
          {role === "admin"
            ? "Admin Dashboard"
            : "Merchant Dashboard"}
        </SidebarTitle>

        {/* Merchant + Admin */}
        {(role === "merchant" || role === "admin") && (
          <>
            <MenuItem to="/dashboard">Overview</MenuItem>
            <MenuItem to="/dashboard/shops">
              Manage Shops
            </MenuItem>
            <MenuItem to="/dashboard/products">
              Manage Products
            </MenuItem>
            <MenuItem to="/dashboard/offers">
              Manage Offers
            </MenuItem>
            <MenuItem to="/dashboard/orders">
              Orders
            </MenuItem>
          </>
        )}

        {/* Admin Extra */}
        {role === "admin" && (
          <>
            <MenuItem to="/admin">
              Admin Panel
            </MenuItem>
            <MenuItem to="/admin/orders">
              All Orders
            </MenuItem>
          </>
        )}
      </Sidebar>

      <Content onClick={() => setOpen(false)}>
        {children}
      </Content>
    </Layout>
  );
}