// src/components/Home/TrendingOffers.jsx
import React, { useMemo, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/* ===============================
   ANIMATIONS
================================ */
const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`;

/* ===============================
   SECTION
================================ */
const Section = styled.section`
  margin: 60px 0;
`;

const Title = styled.h2`
  margin-bottom: 22px;
  font-size: 1.5rem;
  font-weight: 700;
`;

/* ===============================
   GRID
================================ */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 22px;
`;

/* ===============================
   CARD (Accessible)
================================ */
const OfferCard = styled.button`
  position: relative;
  padding: 24px;
  border-radius: 20px;
  border: none;
  text-align: left;
  color: white;
  cursor: pointer;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${({ $g1 }) => $g1},
    ${({ $g2 }) => $g2}
  );
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25);
  }

  &:focus-visible {
    outline: 3px solid white;
    outline-offset: 3px;
  }

  &::after {
    content: "";
    position: absolute;
    top: -40%;
    left: -40%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255,255,255,0.25),
      transparent 60%
    );
    opacity: 0;
    transition: 0.4s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

/* ===============================
   BADGE
================================ */
const Badge = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  padding: 6px 12px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 12px;
  animation: ${float} 3s ease-in-out infinite;
`;

/* ===============================
   TEXT
================================ */
const OfferTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 8px;
  font-weight: 700;
`;

const Description = styled.p`
  font-size: 0.9rem;
  opacity: 0.95;
  margin-bottom: 14px;
`;

const CTA = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: underline;
`;

/* ===============================
   GRADIENT POOL
================================ */
const gradients = [
  ["#ff512f", "#dd2476"],
  ["#11998e", "#38ef7d"],
  ["#396afc", "#2948ff"],
  ["#f7971e", "#ffd200"],
  ["#00c6ff", "#0072ff"],
  ["#8e2de2", "#4a00e0"],
];

/* ===============================
   COMPONENT
================================ */
export default function TrendingOffers() {
  const offersByShop = useSelector(
    (s) => s.offers?.offersByShop || {}
  );

  const navigate = useNavigate();

  const allOffers = useMemo(() => {
    return Object.values(offersByShop || {})
      .flat()
      .filter(Boolean);
  }, [offersByShop]);

  const topOffers = useMemo(() => {
    return [...allOffers]
      .sort(
        (a, b) =>
          (Number(b?.discount) || 0) -
          (Number(a?.discount) || 0)
      )
      .slice(0, 6);
  }, [allOffers]);

  const handleNavigate = useCallback(
    (shopId) => {
      if (shopId) {
        navigate(`/shops/${shopId}`);
      }
    },
    [navigate]
  );

  if (!topOffers.length) {
    return (
      <Section>
        <Title>Trending Offers</Title>
        <p style={{ opacity: 0.6 }}>
          No offers available right now.
        </p>
      </Section>
    );
  }

  return (
    <Section aria-labelledby="trending-title">
      <Title id="trending-title">
        🔥 Trending Offers
      </Title>

      <Grid role="list">
        {topOffers.map((o, index) => {
          const [g1, g2] =
            gradients[index % gradients.length];

          const discount =
            Number(o?.discount) || 0;

          return (
            <OfferCard
              key={o.id}
              role="listitem"
              aria-label={`View offer ${o.title}`}
              $g1={g1}
              $g2={g2}
              onClick={() =>
                handleNavigate(o.shopId)
              }
            >
              {discount > 0 && (
                <Badge>{discount}% OFF</Badge>
              )}

              <OfferTitle>
                {o.title || "Special Offer"}
              </OfferTitle>

              <Description>
                {o.description ||
                  "Limited time exclusive deal!"}
              </Description>

              <CTA>Shop Now →</CTA>
            </OfferCard>
          );
        })}
      </Grid>
    </Section>
  );
}