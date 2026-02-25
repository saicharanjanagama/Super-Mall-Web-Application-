// src/views/ShopDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { getShop } from "../api/shops";
import ProductList from "../features/products/ProductList";
import ProductForm from "../features/products/ProductForm";

import OfferForm from "../features/offers/OfferForm";
import OfferList from "../features/offers/OfferList";

import logger from "../services/logger";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 30px 20px;
  max-width: 1100px;
  margin: auto;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const HeaderCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 24px;
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 30px;
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const Info = styled.p`
  margin: 6px 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 18px;
`;

const Divider = styled.hr`
  margin: 40px 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.muted}33;
`;

const ErrorBox = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.colors.danger};
`;

const LoadingText = styled.p`
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function ShopDetails() {
  const { shopId } = useParams();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getShop(shopId)
      .then((s) => {
        if (!mounted) return;

        if (!s) {
          setError("Shop not found");
        } else {
          setShop(s);
          logger.info("ViewedShopDetails", { shopId });
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load shop");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [shopId]);

  if (loading)
    return (
      <Page>
        <LoadingText>Loading shop details...</LoadingText>
      </Page>
    );

  if (error)
    return (
      <Page>
        <ErrorBox>
          <p>{error}</p>
          <BackLink to="/">← Back to Shops</BackLink>
        </ErrorBox>
      </Page>
    );

  const isOwner =
    user?.role === "merchant" && user.uid === shop.owner;

  return (
    <Page>
      <BackLink to="/">← Back to Shops</BackLink>

      {/* ================= SHOP HEADER ================= */}
      <HeaderCard>
        <Title>{shop.name}</Title>
        <Info><strong>Category:</strong> {shop.category}</Info>
        <Info><strong>Floor:</strong> {shop.floor}</Info>
        <Info>{shop.description}</Info>
      </HeaderCard>

      {/* ================= PRODUCTS SECTION ================= */}
      <Section>
        <SectionTitle>Products</SectionTitle>

        {isOwner && (
          <ProductForm shopId={shop.id} />
        )}

        <ProductList shopId={shop.id} />
      </Section>

      <Divider />

      {/* ================= OFFERS SECTION ================= */}
      <Section>
        <SectionTitle>Offers</SectionTitle>

        {isOwner && (
          <OfferForm shopId={shop.id} />
        )}

        <OfferList shopId={shop.id} />
      </Section>
    </Page>
  );
}