// src/views/dashboard/ManageShops.jsx

import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import ShopForm from "../../features/shops/ShopForm";
import ShopList from "../../features/shops/ShopList";

/* ===============================
   STYLES
================================ */

const Page = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: auto;
`;

const Header = styled.div`
  margin-bottom: 25px;
`;

const Title = styled.h2`
  margin-bottom: 6px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 28px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  margin-bottom: 30px;
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  opacity: 0.7;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

/* ===============================
   COMPONENT
================================ */

export default function ManageShops() {
  const user = useSelector((s) => s.auth.user);

  /* ---------- AUTH CHECK ---------- */
  if (!user) {
    return (
      <Page>
        <EmptyState>
          Please login to manage shops.
        </EmptyState>
      </Page>
    );
  }

  if (user.role !== "merchant") {
    return (
      <Page>
        <EmptyState>
          Only merchants can manage shops.
        </EmptyState>
      </Page>
    );
  }

  /* ---------- UI ---------- */

  return (
    <Page>
      <Header>
        <Title>Manage Shops</Title>
        <Subtitle>
          Create, edit, and organize your store locations.
        </Subtitle>
      </Header>

      {/* ===== CREATE / EDIT SHOP ===== */}
      <SectionCard>
        <ShopForm />
      </SectionCard>

      {/* ===== SHOP LIST ===== */}
      <SectionCard>
        <ShopList />
      </SectionCard>
    </Page>
  );
}