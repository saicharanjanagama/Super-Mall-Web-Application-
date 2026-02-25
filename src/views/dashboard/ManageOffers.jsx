// src/views/dashboard/ManageOffers.jsx

import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import OfferForm from "../../features/offers/OfferForm";
import OfferList from "../../features/offers/OfferList";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 30px;
`;

const Title = styled.h2`
  margin-bottom: 25px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 25px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  margin-bottom: 25px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 30px 0;
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function ManageOffers() {
  const user = useSelector((s) => s.auth.user);

  if (!user) {
    return (
      <Page>
        <EmptyState>Login required to manage offers.</EmptyState>
      </Page>
    );
  }

  if (user.role !== "merchant") {
    return (
      <Page>
        <EmptyState>
          Only merchants can manage offers.
        </EmptyState>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Manage Offers</Title>

      {/* ---------- CREATE / EDIT OFFER ---------- */}
      <Card>
        <OfferForm shopId={user.uid} />
      </Card>

      <Divider />

      {/* ---------- OFFER LIST ---------- */}
      <Card>
        <OfferList shopId={user.uid} />
      </Card>
    </Page>
  );
}