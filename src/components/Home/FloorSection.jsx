// src/components/Home/FloorSection.jsx
import React, { useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ==============================
   WRAPPER
================================ */
const Wrap = styled.section`
  margin: 60px 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

/* ==============================
   GRID
================================ */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 22px;
`;

/* ==============================
   CARD (Now Accessible Button)
================================ */
const Card = styled.button`
  position: relative;
  padding: 28px 20px;
  border-radius: 20px;
  border: none;
  background: linear-gradient(
    135deg,
    ${({ $gradient1 }) => $gradient1},
    ${({ $gradient2 }) => $gradient2}
  );
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  }

  &:focus-visible {
    outline: 3px solid white;
    outline-offset: 3px;
  }

  /* Glow effect */
  &::after {
    content: "";
    position: absolute;
    top: -40%;
    left: -40%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.3),
      transparent 60%
    );
    opacity: 0;
    transition: 0.4s ease;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const Icon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const Label = styled.div`
  font-size: 1.1rem;
  letter-spacing: 0.4px;
`;

/* ==============================
   FLOOR DATA
================================ */
const floors = [
  {
    id: "F0",
    label: "Ground Floor",
    q: "0",
    icon: "🏬",
    gradient1: "#4f46e5",
    gradient2: "#6366f1",
  },
  {
    id: "F1",
    label: "1st Floor",
    q: "1",
    icon: "🛍️",
    gradient1: "#0ea5e9",
    gradient2: "#3b82f6",
  },
  {
    id: "F2",
    label: "2nd Floor",
    q: "2",
    icon: "🍔",
    gradient1: "#f97316",
    gradient2: "#fb923c",
  },
  {
    id: "F3",
    label: "3rd Floor",
    q: "3",
    icon: "💎",
    gradient1: "#ec4899",
    gradient2: "#f472b6",
  },
];

/* ==============================
   COMPONENT
================================ */
export default function FloorSection() {
  const navigate = useNavigate();

  const handleClick = useCallback(
    (floor) => {
      navigate(`/search?q=floor:${floor}`);
    },
    [navigate]
  );

  return (
    <Wrap aria-labelledby="shop-by-floor">
      <Title id="shop-by-floor">
        Shop by Floor
      </Title>

      <Grid role="list">
        {floors.map((f) => (
          <Card
            key={f.id}
            role="listitem"
            aria-label={`Browse ${f.label}`}
            $gradient1={f.gradient1}
            $gradient2={f.gradient2}
            onClick={() => handleClick(f.q)}
          >
            <Icon>{f.icon}</Icon>
            <Label>{f.label}</Label>
          </Card>
        ))}
      </Grid>
    </Wrap>
  );
}