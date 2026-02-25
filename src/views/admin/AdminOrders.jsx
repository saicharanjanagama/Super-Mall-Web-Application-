// src/views/admin/AdminOrders.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchAllOrders } from "../../features/orders/orderSlice";
import { useNavigate } from "react-router-dom";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 30px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Table = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  overflow: hidden;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1.5fr;
  padding: 14px 16px;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.surfaceHover};
`;

const DataRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr 1fr 1.5fr;
  padding: 14px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
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
  width: fit-content;
`;

const EmptyState = styled.div`
  padding: 30px;
  text-align: center;
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function AdminOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { all = [], loading } = useSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  if (loading)
    return (
      <Page>
        <p>Loading orders...</p>
      </Page>
    );

  return (
    <Page>
      <Title>All Orders</Title>

      <Table>
        <HeaderRow>
          <div>Order ID</div>
          <div>User</div>
          <div>Total</div>
          <div>Status</div>
          <div>Date</div>
        </HeaderRow>

        {all.length === 0 && (
          <EmptyState>No orders found.</EmptyState>
        )}

        {all.map((order) => {
          // Firestore timestamp safety
          const created =
            order.createdAt?.seconds
              ? new Date(order.createdAt.seconds * 1000)
              : new Date(order.createdAt);

          return (
            <DataRow
              key={order.id}
              onClick={() =>
                navigate(`/admin/orders/${order.id}`, {
                  state: { order },
                })
              }
            >
              <div>{order.id}</div>

              <div>{order.email}</div>

              <div>
                ₹{order.total?.toLocaleString("en-IN")}
              </div>

              <div>
                <StatusBadge status={order.status}>
                  {order.status}
                </StatusBadge>
              </div>

              <div>
                {created?.toLocaleString("en-IN")}
              </div>
            </DataRow>
          );
        })}
      </Table>
    </Page>
  );
}