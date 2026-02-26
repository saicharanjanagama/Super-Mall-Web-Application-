// src/views/Dashboard.jsx

import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ShopForm from "../features/shops/ShopForm";
import ShopList from "../features/shops/ShopList";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 40px;
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
  opacity: 0.7;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 22px;
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const StatValue = styled.h3`
  margin-top: 8px;
`;

const QuickActions = styled.div`
  margin-bottom: 40px;
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radius};
  border: none;
  cursor: pointer;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  margin-right: 12px;

  &:hover {
    opacity: 0.9;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
  }
`;

const SectionDivider = styled.hr`
  margin: 40px 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border || "#eee"};
`;

/* ===================== COMPONENT ===================== */

export default function Dashboard() {
  const navigate = useNavigate();

  const user = useSelector((s) => s.auth.user);
  const shops = useSelector((s) => s.shops?.shops || []);
  const products = useSelector((s) => s.products?.products || []);
  const merchantOrders = useSelector(
    (s) => s.orders?.merchantOrders || []
  );

  const role = user?.role;

  /* ===== SAFE REVENUE CALC ===== */
  const revenue = useMemo(() => {
    return merchantOrders
      .filter((o) => o.status === "Delivered")
      .reduce(
        (sum, o) => sum + (Number(o.total) || 0),
        0
      );
  }, [merchantOrders]);

  if (!user) return null;

  return (
    <Page>
      {/* ===== HEADER ===== */}
      <Header>
        <Title>
          Welcome back, {user?.profile?.name || user.email} 👋
        </Title>
        <Subtitle>
          {role === "admin"
            ? "Manage platform data and monitor system performance."
            : "Manage your shops and grow your business."}
        </Subtitle>
      </Header>

      {/* ===== STATS (Merchant Only) ===== */}
      {role === "merchant" && (
        <>
          <StatsGrid>
            <Card>
              <p>Total Shops</p>
              <StatValue>{shops.length}</StatValue>
            </Card>

            <Card>
              <p>Total Products</p>
              <StatValue>{products.length}</StatValue>
            </Card>

            <Card>
              <p>Total Orders</p>
              <StatValue>{merchantOrders.length}</StatValue>
            </Card>

            <Card>
              <p>Total Revenue</p>
              <StatValue>
                ₹{revenue.toLocaleString("en-IN")}
              </StatValue>
            </Card>
          </StatsGrid>

          {/* ===== QUICK ACTIONS ===== */}
          <QuickActions>
            <h3>Quick Actions</h3>
            <div style={{ marginTop: 10 }}>
              <ActionButton
                onClick={() =>
                  navigate("/dashboard/products")
                }
                aria-label="Manage Products"
              >
                Manage Products
              </ActionButton>

              <ActionButton
                onClick={() =>
                  navigate("/dashboard/orders")
                }
                aria-label="View Orders"
              >
                View Orders
              </ActionButton>

              <ActionButton
                onClick={() =>
                  navigate("/dashboard/offers")
                }
                aria-label="Manage Offers"
              >
                Manage Offers
              </ActionButton>
            </div>
          </QuickActions>

          <SectionDivider />

          {/* ===== SHOP MANAGEMENT ===== */}
          <h3>Manage Shops</h3>
          <ShopForm />

          <SectionDivider />

          <ShopList />
        </>
      )}

      {/* ===== ADMIN VIEW ===== */}
      {role === "admin" && (
        <>
          <StatsGrid>
            <Card>
              <p>Total Shops</p>
              <StatValue>{shops.length}</StatValue>
            </Card>

            <Card>
              <p>Total Products</p>
              <StatValue>{products.length}</StatValue>
            </Card>

            <Card>
              <p>Total Orders</p>
              <StatValue>
                {useSelector((s) => s.orders?.adminOrders?.length || 0)}
              </StatValue>
            </Card>
          </StatsGrid>

          <QuickActions>
            <h3>Admin Quick Actions</h3>
            <div style={{ marginTop: 10 }}>
              <ActionButton
                onClick={() => navigate("/admin")}
              >
                Go to Admin Panel
              </ActionButton>
            </div>
          </QuickActions>
        </>
      )}
    </Page>
  );
}