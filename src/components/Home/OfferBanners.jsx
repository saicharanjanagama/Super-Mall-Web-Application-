// src/components/Home/OfferBanners.jsx
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ==============================
   WRAPPER
================================ */
const Wrap = styled.section`
  margin: 60px 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
`;

/* ==============================
   BANNER CARD
================================ */
const Banner = styled.div`
  position: relative;
  padding: 28px 22px;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${({ g1 }) => g1},
    ${({ g2 }) => g2}
  );
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.35s ease;

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25);
  }

  /* Shine animation */
  &::after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.3),
      transparent 60%
    );
    opacity: 0;
    transition: 0.5s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 10px;
  font-weight: 700;
`;

const Sub = styled.p`
  font-size: 0.95rem;
  opacity: 0.95;
  margin-bottom: 16px;
`;

const CTA = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: underline;
`;

/* ==============================
   DATA
================================ */
const offers = [
  {
    id: 1,
    title: "🔥 Big Electronics Sale",
    text: "Up to 50% off on top gadgets & accessories.",
    link: "/search?q=electronics",
    g1: "#ff512f",
    g2: "#dd2476",
  },
  {
    id: 2,
    title: "🛍 Fashion Fiesta",
    text: "Buy 1 Get 1 Free – Limited time offer!",
    link: "/search?q=clothing",
    g1: "#11998e",
    g2: "#38ef7d",
  },
  {
    id: 3,
    title: "🍕 Food Festival",
    text: "Flat 30% off on your favorite restaurants.",
    link: "/search?q=food",
    g1: "#f7971e",
    g2: "#ffd200",
  },
];

/* ==============================
   COMPONENT
================================ */
export default function OfferBanners() {
  const navigate = useNavigate();

  return (
    <Wrap>
      <Grid>
        {offers.map((o) => (
          <Banner
            key={o.id}
            g1={o.g1}
            g2={o.g2}
            onClick={() => navigate(o.link)}
          >
            <Title>{o.title}</Title>
            <Sub>{o.text}</Sub>
            <CTA>Shop Now →</CTA>
          </Banner>
        ))}
      </Grid>
    </Wrap>
  );
}