// src/views/OrderList.jsx

import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserOrders,
  selectUserOrders,
  selectOrderFetchStatus,
  selectOrderError,
} from "../features/orders/orderSlice";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 40px;
  max-width: 1000px;
  margin: auto;
`;

const Title = styled.h2`
  margin-bottom: 25px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 18px;
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
      ? theme.colors.danger || "#dc2626"
      : status === "Shipped"
      ? "#0284c7"
      : "#f59e0b"};
  color: white;
`;

const Items = styled.div`
  margin-top: 15px;
  border-top: 1px solid ${({ theme }) => theme.colors.border || "#eee"};
  padding-top: 10px;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
`;

const ToggleBtn = styled.button`
  margin-top: 10px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function OrderList() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const orders = useSelector(selectUserOrders);
  const fetchStatus = useSelector(selectOrderFetchStatus);
  const error = useSelector(selectOrderError);

  const [expanded, setExpanded] = useState(null);

  /* ===== FETCH ORDERS ===== */
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchUserOrders(user.uid));
    }
  }, [user?.uid, dispatch]);

  /* ===== SORT NEWEST FIRST ===== */
  const sortedOrders = useMemo(() => {
    return [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }, [orders]);

  if (!user) {
    return (
      <Page>
        <EmptyState>Please login to view orders.</EmptyState>
      </Page>
    );
  }

  if (fetchStatus === "loading") {
    return (
      <Page>
        <EmptyState>Loading orders…</EmptyState>
      </Page>
    );
  }

  if (fetchStatus === "failed") {
    return (
      <Page>
        <EmptyState>
          {error || "Failed to load orders."}
        </EmptyState>
      </Page>
    );
  }

  if (!sortedOrders.length) {
    return (
      <Page>
        <EmptyState>No orders found.</EmptyState>
      </Page>
    );
  }

  return (
    <Page>
      <Title>My Orders</Title>

      {sortedOrders.map((o) => {
        const created =
          o?.createdAt?.seconds
            ? new Date(o.createdAt.seconds * 1000)
            : new Date(o.createdAt);

        const isOpen = expanded === o.id;
        const total = Number(o.total) || 0;

        return (
          <Card key={o.id}>
            <Row>
              <div>
                <strong>Order #{o.id}</strong>
                <br />
                {created?.toLocaleString("en-IN")}
              </div>

              <div style={{ textAlign: "right" }}>
                <StatusBadge status={o.status}>
                  {o.status || "Pending"}
                </StatusBadge>
                <br />
                <strong>
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>
            </Row>

            <ToggleBtn
              onClick={() =>
                setExpanded(isOpen ? null : o.id)
              }
            >
              {isOpen ? "Hide Details" : "View Details"}
            </ToggleBtn>

            {isOpen && (
              <Items>
                {(o.items || []).map((i) => {
                  const price = Number(i.price) || 0;
                  const qty = Number(i.qty) || 0;

                  return (
                    <ItemRow key={i.id}>
                      <span>
                        {i.name} × {qty}
                      </span>
                      <span>
                        ₹
                        {(price * qty).toLocaleString("en-IN")}
                      </span>
                    </ItemRow>
                  );
                })}
              </Items>
            )}
          </Card>
        );
      })}
    </Page>
  );
}