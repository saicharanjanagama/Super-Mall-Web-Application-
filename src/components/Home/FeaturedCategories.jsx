// src/components/Home/FeaturedCategories.jsx
import React, { useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ==============================
   WRAPPER
================================ */
const Wrap = styled.section`
  margin: 50px 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 22px;
  color: ${({ theme }) => theme.colors.text};
`;

/* ==============================
   GRID
================================ */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 22px;
`;

/* ==============================
   CARD (Now Accessible Button)
================================ */
const Card = styled.button`
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  height: 170px;
  background: #eee;
  border: none;
  padding: 0;
  box-shadow: 0 10px 30px rgba(30, 40, 100, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(79, 70, 229, 0.25);
  }

  &:hover img {
    transform: scale(1.08);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;

/* ==============================
   IMAGE
================================ */
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  display: block;
`;

/* ==============================
   GRADIENT OVERLAY
================================ */
const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65),
    rgba(0, 0, 0, 0.2),
    transparent
  );
  display: flex;
  align-items: flex-end;
  padding: 16px;
`;

/* ==============================
   LABEL
================================ */
const Label = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1.05rem;
  letter-spacing: 0.4px;
`;

/* ==============================
   DATA
================================ */
const items = [
  { id: "electronics", name: "Electronics", img: "/images/electronics.jpg" },
  { id: "fashion", name: "Fashion", img: "/images/shop-clothing.avif" },
  { id: "food", name: "Food", img: "/images/food.jpg" },
  { id: "shoes", name: "Shoes", img: "/images/shoes.jpg" },
  { id: "home", name: "Home Items", img: "/images/home.jpg" },
  { id: "jewellery", name: "Jewellery", img: "/images/jewellery.jpg" },
];

/* ==============================
   COMPONENT
================================ */
export default function FeaturedCategories() {
  const navigate = useNavigate();

  const handleClick = useCallback((name) => {
    navigate(`/search?q=${encodeURIComponent(name)}`);
  }, [navigate]);

  return (
    <Wrap aria-labelledby="featured-categories">
      <Title id="featured-categories">
        Featured Categories
      </Title>

      <Grid role="list">
        {items.map((c) => (
          <Card
            key={c.id}
            role="listitem"
            aria-label={`Browse ${c.name}`}
            onClick={() => handleClick(c.name)}
          >
            <Img
              src={c.img}
              alt={c.name}
              loading="lazy"
            />

            <Overlay>
              <Label>{c.name}</Label>
            </Overlay>
          </Card>
        ))}
      </Grid>
    </Wrap>
  );
}