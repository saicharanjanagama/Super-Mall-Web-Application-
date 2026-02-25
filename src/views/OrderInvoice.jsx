// src/views/OrderInvoice.jsx

import React from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: auto;

  @media print {
    padding: 0;
  }
`;

const Title = styled.h2`
  margin-bottom: 25px;
`;

const Box = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 25px;
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 20px;

  @media print {
    box-shadow: none;
    border: 1px solid #ddd;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StatusBadge = styled.span`
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status, theme }) =>
    status === "Delivered"
      ? "#16a34a"
      : status === "Cancelled"
      ? theme.colors.danger
      : status === "Shipped"
      ? "#0284c7"
      : "#f59e0b"};
  color: white;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.muted};
`;

const TotalSection = styled.div`
  margin-top: 15px;
  text-align: right;
`;

const PrintButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;
  font-weight: 600;

  @media print {
    display: none;
  }
`;

const BackLink = styled.div`
  margin-top: 20px;

  @media print {
    display: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function OrderInvoice() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <Page>
        <EmptyState>No invoice data available.</EmptyState>
      </Page>
    );
  }

  const created =
    order.createdAt?.seconds
      ? new Date(order.createdAt.seconds * 1000)
      : new Date(order.createdAt);

  const subtotal = order.items.reduce(
    (sum, it) => sum + it.price * (it.qty || 1),
    0
  );

  return (
    <Page>
      <Title>Invoice</Title>

      {/* ===== ORDER INFO ===== */}
      <Box>
        <Row>
          <div>
            <strong>Order ID:</strong> {order.id}
          </div>
          <StatusBadge status={order.status}>
            {order.status}
          </StatusBadge>
        </Row>

        <Row>
          <div>
            <strong>Date:</strong>{" "}
            {created?.toLocaleString("en-IN")}
          </div>
        </Row>
      </Box>

      {/* ===== ITEMS ===== */}
      <Box>
        <h3>Items</h3>

        {order.items.map((it) => (
          <ItemRow key={it.id}>
            <span>
              {it.name} × {it.qty || 1}
            </span>
            <span>
              ₹
              {(
                it.price * (it.qty || 1)
              ).toLocaleString("en-IN")}
            </span>
          </ItemRow>
        ))}

        <TotalSection>
          <p>
            <strong>Subtotal:</strong> ₹
            {subtotal.toLocaleString("en-IN")}
          </p>

          <p>
            <strong>Shipping:</strong> Free
          </p>

          <h3>
            Total: ₹
            {order.total?.toLocaleString("en-IN")}
          </h3>
        </TotalSection>
      </Box>

      {/* ===== DELIVERY INFO ===== */}
      <Box>
        <h3>Delivery Information</h3>
        <p>
          <strong>Name:</strong> {order.name || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {order.phone || "N/A"}
        </p>
        <p>
          <strong>Address:</strong>{" "}
          {order.address || "N/A"}
        </p>
      </Box>

      <PrintButton onClick={() => window.print()}>
        🖨 Print Invoice
      </PrintButton>

      <BackLink>
        <Link to="/orders">← Back to My Orders</Link>
      </BackLink>
    </Page>
  );
}