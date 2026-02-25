// src/views/admin/AdminOrderDetails.jsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { updateOrderStatus } from "../../features/orders/orderSlice";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 30px;
  max-width: 900px;
  margin: auto;
`;

const Title = styled.h2`
  margin-bottom: 25px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  margin-bottom: 20px;
`;

const StatusBadge = styled.span`
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radius.round};
  font-size: 13px;
  font-weight: 600;
  background: ${({ status, theme }) =>
    status === "Delivered"
      ? theme.colors.success
      : status === "Cancelled"
      ? theme.colors.danger
      : status === "Shipped"
      ? theme.colors.info
      : theme.colors.warning};
  color: white;
`;

const ItemRow = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  cursor: pointer;
  font-weight: 500;
  background: ${({ variant, theme }) =>
    variant === "cancel"
      ? theme.colors.danger
      : theme.colors.primary};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

/* ===================== COMPONENT ===================== */

export default function AdminOrderDetails() {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const order = state?.order;

  if (!order)
    return (
      <Page>
        <p>Order data missing.</p>
      </Page>
    );

  const updateStatus = async (status) => {
    if (status === "Cancelled") {
      const confirm = window.confirm(
        "Are you sure you want to cancel this order?"
      );
      if (!confirm) return;
    }

    try {
      setLoading(true);

      await dispatch(
        updateOrderStatus({
          orderId: order.id,
          updates: { status },
        })
      ).unwrap();

      alert("Order status updated successfully.");
    } catch (err) {
      alert("Failed to update order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Title>Order Details</Title>

      {/* ================= ORDER INFO ================= */}
      <Card>
        <h3>Order ID: {order.id}</h3>
        <p>
          <b>User:</b> {order.email}
        </p>
        <p>
          <b>Total:</b> ₹{order.total?.toLocaleString("en-IN")}
        </p>
        <p>
          <b>Status:</b>{" "}
          <StatusBadge status={order.status}>
            {order.status}
          </StatusBadge>
        </p>
      </Card>

      {/* ================= ITEMS ================= */}
      <Card>
        <h3>Items</h3>
        {order.items?.map((it) => (
          <ItemRow key={it.id}>
            {it.name} × {it.qty} — ₹
            {(it.price * it.qty).toLocaleString("en-IN")}
          </ItemRow>
        ))}
      </Card>

      {/* ================= PAYMENT PROOF ================= */}
      {order.paymentProofUrl && (
        <Card>
          <h3>Payment Proof</h3>
          <img
            src={order.paymentProofUrl}
            alt="Payment Proof"
            style={{
              maxWidth: "300px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          />
        </Card>
      )}

      {/* ================= ACTIONS ================= */}
      <Card>
        <h3>Update Status</h3>

        <ButtonRow>
          <ActionButton
            onClick={() => updateStatus("Processing")}
            disabled={loading}
          >
            Processing
          </ActionButton>

          <ActionButton
            onClick={() => updateStatus("Shipped")}
            disabled={loading}
          >
            Shipped
          </ActionButton>

          <ActionButton
            onClick={() => updateStatus("Delivered")}
            disabled={loading}
          >
            Delivered
          </ActionButton>

          <ActionButton
            variant="cancel"
            onClick={() => updateStatus("Cancelled")}
            disabled={loading}
          >
            Cancel
          </ActionButton>
        </ButtonRow>
      </Card>
    </Page>
  );
}