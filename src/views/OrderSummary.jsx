// src/views/OrderSummary.jsx

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 30px 20px;
  max-width: 900px;
  margin: auto;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 20px;
`;

const ItemRow = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border || "#eee"};
  display: flex;
  justify-content: space-between;
  font-size: 15px;

  &:last-child {
    border-bottom: none;
  }
`;

const Total = styled.h3`
  margin-top: 10px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: ${({ theme }) => theme.radius};
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  font-size: 15px;
  margin-top: 10px;

  &:hover {
    opacity: 0.9;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.p`
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function OrderSummary() {
  const cart = useSelector((s) => s.cart?.items || []);
  const user = useSelector((s) => s.auth?.user);
  const navigate = useNavigate();

  /* ===== SAFE TOTAL CALC ===== */
  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item?.price) || 0;
      const qty =
        Number(item?.qty) ||
        Number(item?.quantity) ||
        1;

      return sum + price * qty;
    }, 0);
  }, [cart]);

  if (!user) {
    return (
      <Page>
        <EmptyState>
          Please login to view order summary.
        </EmptyState>
      </Page>
    );
  }

  if (!cart.length) {
    return (
      <Page>
        <EmptyState>Your cart is empty.</EmptyState>
        <BackLink to="/cart">← Back to Cart</BackLink>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Order Summary</Title>

      {/* ===== ITEMS ===== */}
      <Card>
        <h3>Items</h3>

        {cart.map((item) => {
          const price = Number(item?.price) || 0;
          const qty =
            Number(item?.qty) ||
            Number(item?.quantity) ||
            1;

          return (
            <ItemRow key={item.id}>
              <span>
                {item.name} × {qty}
              </span>
              <span>
                ₹
                {(price * qty).toLocaleString("en-IN")}
              </span>
            </ItemRow>
          );
        })}
      </Card>

      {/* ===== DELIVERY INFO ===== */}
      <Card>
        <h3>Delivery Details</h3>
        <p>
          <b>Name:</b>{" "}
          {user?.profile?.name || "User"}
        </p>
        <p>
          <b>Email:</b> {user?.email || "N/A"}
        </p>
        <p style={{ opacity: 0.6, marginTop: 8 }}>
          Full delivery address will be entered on the checkout page.
        </p>
      </Card>

      {/* ===== TOTAL ===== */}
      <Card>
        <Total>
          Total: ₹{total.toLocaleString("en-IN")}
        </Total>
      </Card>

      {/* ===== ACTIONS ===== */}
      <PrimaryButton
        onClick={() => navigate("/checkout")}
      >
        Proceed to Checkout →
      </PrimaryButton>

      <BackLink to="/cart">
        ← Back to Cart
      </BackLink>
    </Page>
  );
}