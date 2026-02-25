// src/views/dashboard/MerchantOverview.jsx

import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: auto;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  margin-bottom: 6px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 35px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 22px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

const StatValue = styled.h3`
  margin-top: 8px;
  font-size: 24px;
`;

const QuickSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 25px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const ButtonRow = styled.div`
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  cursor: pointer;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

/* ===================== COMPONENT ===================== */

export default function MerchantOverview() {
  const navigate = useNavigate();

  const user = useSelector((s) => s.auth.user);
  const { products = [] } = useSelector((s) => s.products || {});
  const { merchant: orders = [] } =
    useSelector((s) => s.orders || { merchant: [] });
  const { shops = [] } =
    useSelector((s) => s.shops || { shops: [] });

  /* ===== CALCULATED STATS ===== */

  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + (o.total || 0), 0);
  }, [orders]);

  return (
    <Page>
      {/* ===== HEADER ===== */}
      <Header>
        <Title>
          Welcome, {user?.profile?.name || "Merchant"} 👋
        </Title>
        <Subtitle>
          Manage your shops, products, and orders from one place.
        </Subtitle>
      </Header>

      {/* ===== STAT CARDS ===== */}
      <StatsGrid>
        <StatCard>
          <p>Total Shops</p>
          <StatValue>{shops.length}</StatValue>
        </StatCard>

        <StatCard>
          <p>Total Products</p>
          <StatValue>{products.length}</StatValue>
        </StatCard>

        <StatCard>
          <p>Total Orders</p>
          <StatValue>{orders.length}</StatValue>
        </StatCard>

        <StatCard>
          <p>Total Revenue</p>
          <StatValue>
            ₹{totalRevenue.toLocaleString("en-IN")}
          </StatValue>
        </StatCard>
      </StatsGrid>

      {/* ===== QUICK ACTIONS ===== */}
      <QuickSection>
        <h3>Quick Actions</h3>

        <ButtonRow>
          <ActionButton
            onClick={() => navigate("/dashboard/shops")}
          >
            Manage Shops
          </ActionButton>

          <ActionButton
            onClick={() => navigate("/dashboard/products")}
          >
            Manage Products
          </ActionButton>

          <ActionButton
            onClick={() => navigate("/dashboard/orders")}
          >
            View Orders
          </ActionButton>

          <ActionButton
            onClick={() => navigate("/dashboard/offers")}
          >
            Manage Offers
          </ActionButton>
        </ButtonRow>
      </QuickSection>
    </Page>
  );
}