// src/views/MyOrders.jsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserOrders } from "../features/orders/orderSlice";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 40px;
  max-width: 1000px;
  margin: auto;
`;

const Title = styled.h2`
  margin-bottom: 25px;
`;

const OrderCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  margin-bottom: 18px;
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
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

const Items = styled.div`
  margin-top: 15px;
  border-top: 1px solid ${({ theme }) => theme.colors.muted};
  padding-top: 10px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  opacity: 0.7;
`;

const ToggleBtn = styled.button`
  margin-top: 10px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-weight: 500;
`;

/* ===================== COMPONENT ===================== */

export default function MyOrders() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { list: orders = [], loading } = useSelector(
    (s) => s.orders || {}
  );

  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserOrders(user.uid));
    }
  }, [user, dispatch]);

  if (!user) {
    return (
      <Page>
        <EmptyState>
          Please login to view your orders.
        </EmptyState>
      </Page>
    );
  }

  if (loading) {
    return (
      <Page>
        <EmptyState>Loading orders…</EmptyState>
      </Page>
    );
  }

  if (orders.length === 0) {
    return (
      <Page>
        <EmptyState>
          You haven't placed any orders yet.
        </EmptyState>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Your Orders</Title>

      {orders.map((o) => {
        const created =
          o.createdAt?.seconds
            ? new Date(o.createdAt.seconds * 1000)
            : new Date(o.createdAt);

        const isOpen = expanded === o.id;

        return (
          <OrderCard key={o.id}>
            <Row>
              <div>
                <strong>Order ID:</strong> {o.id}
                <br />
                <strong>Date:</strong>{" "}
                {created?.toLocaleString("en-IN")}
              </div>

              <div>
                <StatusBadge status={o.status}>
                  {o.status}
                </StatusBadge>
                <br />
                <strong>
                  ₹{o.total?.toLocaleString("en-IN")}
                </strong>
              </div>
            </Row>

            <ToggleBtn
              onClick={() =>
                setExpanded(isOpen ? null : o.id)
              }
            >
              {isOpen
                ? "Hide Details"
                : "View Details"}
            </ToggleBtn>

            {isOpen && (
              <Items>
                {o.items?.map((item) => (
                  <ItemRow key={item.id}>
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>
                      ₹
                      {(
                        item.price * item.qty
                      ).toLocaleString("en-IN")}
                    </span>
                  </ItemRow>
                ))}
              </Items>
            )}
          </OrderCard>
        );
      })}
    </Page>
  );
}