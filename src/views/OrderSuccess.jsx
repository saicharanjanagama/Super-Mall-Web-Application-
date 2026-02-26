// src/views/OrderSuccess.jsx

import React from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* ===================== STYLES ===================== */

const Page = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 40px;
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const Icon = styled.div`
  width: 80px;
  height: 80px;
  margin: auto;
  border-radius: 50%;
  background: #16a34a;
  color: white;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  margin-bottom: 10px;
`;

const Text = styled.p`
  opacity: 0.7;
  margin-bottom: 25px;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 12px 22px;
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  font-weight: 600;
  margin: 8px;

  &:hover {
    opacity: 0.9;
  }
`;

const SecondaryLink = styled(Link)`
  display: block;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

/* ===================== COMPONENT ===================== */

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;
  const orderId = order?.id;

  return (
    <Page>
      <Card role="alert" aria-live="polite">
        <Icon>✓</Icon>

        <Title>Order Placed Successfully!</Title>

        <Text>
          {orderId
            ? `Your order #${orderId} has been placed successfully.`
            : "Your order has been placed successfully."}
        </Text>

        <Button to="/orders">
          View My Orders
        </Button>

        <Button to="/">
          Continue Shopping
        </Button>

        <SecondaryLink to="/">
          ← Back to Home
        </SecondaryLink>
      </Card>
    </Page>
  );
}