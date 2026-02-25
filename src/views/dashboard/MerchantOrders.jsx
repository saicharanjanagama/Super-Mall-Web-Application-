// src/views/dashboard/MerchantOrders.jsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchOrdersByMerchant,
  updateOrderStatus,
} from "../../features/orders/orderSlice";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 32px;
  max-width: 1100px;
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
  font-size: 12px;
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
  padding: 6px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Select = styled.select`
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 10px;
`;

const EmptyState = styled.div`
  padding: 50px;
  text-align: center;
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function MerchantOrders() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.user || null);

  // ✅ Use merchant array from slice
  const { merchant: orders = [], loading } =
    useSelector((s) => s.orders || { merchant: [] });

  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchOrdersByMerchant(user.uid));
    }
  }, [dispatch, user]);

  const changeStatus = async (orderId, status) => {
    const confirm = window.confirm(
      `Change order status to "${status}"?`
    );
    if (!confirm) return;

    try {
      setUpdating(orderId);

      await dispatch(
        updateOrderStatus({
          orderId,
          updates: { status },
        })
      ).unwrap();
    } catch (err) {
      alert("Failed to update order.");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <Page>
        <p>Loading orders...</p>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Merchant Orders</Title>

      {orders.length === 0 ? (
        <EmptyState>No orders yet.</EmptyState>
      ) : (
        orders.map((o) => {
          const created =
            o.createdAt?.seconds
              ? new Date(o.createdAt.seconds * 1000)
              : new Date(o.createdAt);

          return (
            <Card key={o.id}>
              <h3>Order #{o.id}</h3>

              <p>
                <b>Status:</b>{" "}
                <StatusBadge status={o.status}>
                  {o.status}
                </StatusBadge>
              </p>

              <p>
                <b>Total:</b> ₹
                {o.total?.toLocaleString("en-IN")}
              </p>

              <p>
                <b>Customer:</b> {o.customerName}
              </p>

              <p>
                <b>Email:</b> {o.customerEmail}
              </p>

              <p>
                <b>Address:</b> {o.address}
              </p>

              <p>
                <b>Date:</b>{" "}
                {created?.toLocaleString("en-IN")}
              </p>

              <h4>Items:</h4>

              {o.items?.map((i) => (
                <ItemRow key={i.id}>
                  {i.name} — ₹
                  {(i.price * i.qty).toLocaleString(
                    "en-IN"
                  )}{" "}
                  ({i.qty} × ₹
                  {i.price.toLocaleString("en-IN")})
                </ItemRow>
              ))}

              <Select
                value={o.status}
                disabled={updating === o.id}
                onChange={(e) =>
                  changeStatus(o.id, e.target.value)
                }
              >
                <option value="Pending">Pending</option>
                <option value="Processing">
                  Processing
                </option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">
                  Delivered
                </option>
                <option value="Cancelled">
                  Cancelled
                </option>
              </Select>
            </Card>
          );
        })
      )}
    </Page>
  );
}