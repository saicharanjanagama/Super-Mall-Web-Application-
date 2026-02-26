// src/features/admin/AdminDashboard.jsx

import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  getShopsAdmin,
  getLogs,
  setShopStatus,
} from "./adminSlice";
import { Button } from "../../components/UI/Button";

/* ===============================
   STYLES
================================ */

const Page = styled.div`
  padding: 40px;
`;

const Title = styled.h1`
  margin-bottom: 30px;
`;

const Section = styled.div`
  margin-bottom: 50px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 18px;
`;

const Grid = styled.div`
  display: grid;
  gap: 20px;
`;

const Card = styled.div`
  padding: 20px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;

  background: ${({ $status }) =>
    $status === "approved"
      ? "#d4edda"
      : $status === "rejected"
      ? "#f8d7da"
      : "#fff3cd"};

  color: ${({ $status }) =>
    $status === "approved"
      ? "#155724"
      : $status === "rejected"
      ? "#721c24"
      : "#856404"};
`;

const LogItem = styled.div`
  padding: 12px 16px;
  border-radius: 10px;
  background: #f9fafb;
  margin-bottom: 10px;
  font-size: 0.9rem;
`;

/* ===============================
   COMPONENT
================================ */

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const {
    users,
    shops,
    logs,
    usersStatus,
    shopsStatus,
    logsStatus,
    error,
  } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getShopsAdmin());
    dispatch(getLogs());
  }, [dispatch]);

  return (
    <Page>
      <Title>Admin Dashboard</Title>

      {error && (
        <p style={{ color: "red", marginBottom: 20 }}>
          ⚠ {error}
        </p>
      )}

      {/* ================= USERS ================= */}
      <Section>
        <SectionTitle>Users</SectionTitle>

        {usersStatus === "loading" && <p>Loading users...</p>}

        {users.length === 0 && usersStatus === "succeeded" && (
          <p>No users found.</p>
        )}

        <Grid>
          {users.map((u) => (
            <Card key={u.id}>
              <Row>
                <div>
                  <strong>{u.profile?.name || "No Name"}</strong>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>
                    {u.email}
                  </div>
                </div>

                <Badge $status={u.role}>
                  {u.role}
                </Badge>
              </Row>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* ================= SHOPS ================= */}
      <Section>
        <SectionTitle>Shops Approval</SectionTitle>

        {shopsStatus === "loading" && <p>Loading shops...</p>}

        {shops.length === 0 && shopsStatus === "succeeded" && (
          <p>No shops available.</p>
        )}

        <Grid>
          {shops.map((shop) => (
            <Card key={shop.id}>
              <Row>
                <div>
                  <h4 style={{ marginBottom: 4 }}>
                    {shop.name}
                  </h4>
                  <div style={{ fontSize: 13, opacity: 0.7 }}>
                    Owner: {shop.owner}
                  </div>
                </div>

                <Badge $status={shop.status || "pending"}>
                  {shop.status || "pending"}
                </Badge>
              </Row>

              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <Button
                  size="sm"
                  onClick={() =>
                    dispatch(
                      setShopStatus({
                        id: shop.id,
                        status: "approved",
                      })
                    )
                  }
                >
                  Approve
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() =>
                    dispatch(
                      setShopStatus({
                        id: shop.id,
                        status: "rejected",
                      })
                    )
                  }
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* ================= LOGS ================= */}
      <Section>
        <SectionTitle>Activity Logs</SectionTitle>

        {logsStatus === "loading" && <p>Loading logs...</p>}

        {logs.length === 0 && logsStatus === "succeeded" && (
          <p>No activity yet.</p>
        )}

        {logs.map((log) => (
          <LogItem key={log.id}>
            📘 <strong>{log.event}</strong> —{" "}
            {log.timestamp
              ? new Date(log.timestamp).toLocaleString()
              : "N/A"}
          </LogItem>
        ))}
      </Section>
    </Page>
  );
}