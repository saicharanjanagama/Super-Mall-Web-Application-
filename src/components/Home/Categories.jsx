// src/components/Home/Categories.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ===============================
   WRAPPER
================================= */
const Wrap = styled.section`
  margin: 30px 0 40px;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 18px;
  color: ${({ theme }) => theme.colors.text};
`;

/* ===============================
   SCROLL AREA
================================= */
const RowContainer = styled.div`
  position: relative;
`;

const Row = styled.div`
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding: 10px 4px;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/* ===============================
   CATEGORY CARD
================================= */
const Cat = styled.button`
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: 180px;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(145deg, #ffffff, #f5f7fa);
  box-shadow: 0 8px 24px rgba(20, 40, 120, 0.08);
  display: flex;
  gap: 14px;
  align-items: center;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 18px 40px rgba(79, 70, 229, 0.18);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Thumb = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 14px;
  overflow: hidden;
  background: #f1f5ff;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

/* ===============================
   NAV BUTTONS
================================= */
const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-50%) scale(1.15);
    box-shadow: 0 12px 28px rgba(79, 70, 229, 0.3);
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

const NavBtnLeft = styled(NavBtn)`
  left: -12px;
`;

const NavBtnRight = styled(NavBtn)`
  right: -12px;
`;

/* ===============================
   DEMO DATA
================================= */
const demo = [
  { id: "c1", name: "Clothing", image: "/images/shop-clothing.avif" },
  { id: "c2", name: "Electronics", image: "/images/electronics.jpg" },
  { id: "c3", name: "Food", image: "/images/food.jpg" },
  { id: "c4", name: "Jewellery", image: "/images/jewellery.jpg" },
  { id: "c5", name: "Shoes", image: "/images/shoes.jpg" },
  { id: "c6", name: "Home", image: "/images/home.jpg" },
];

/* ===============================
   COMPONENT
================================= */
export default function Categories({ items = demo }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateButtons = useCallback(() => {
    if (!ref.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = ref.current;

    setShowLeft(scrollLeft > 5);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    updateButtons();

    const node = ref.current;
    if (!node) return;

    node.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    return () => {
      node.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  const scroll = (dir = 1) => {
    if (!ref.current) return;

    const width = ref.current.clientWidth;

    ref.current.scrollBy({
      left: dir * width * 0.7,
      behavior: "smooth",
    });
  };

  return (
    <Wrap>
      <Title>Explore Categories</Title>

      <RowContainer>
        {showLeft && (
          <NavBtnLeft
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
          >
            ‹
          </NavBtnLeft>
        )}

        <Row
          ref={ref}
          role="list"
          aria-label="Category list"
        >
          {items.map((c) => (
            <Cat
              key={c.id}
              role="listitem"
              aria-label={`Browse ${c.name}`}
              onClick={() =>
                navigate(
                  `/search?q=${encodeURIComponent(c.name)}`
                )
              }
            >
              <Thumb>
                {c.image && (
                  <img
                    src={c.image}
                    alt={c.name}
                    loading="lazy"
                  />
                )}
              </Thumb>
              <Label>{c.name}</Label>
            </Cat>
          ))}
        </Row>

        {showRight && (
          <NavBtnRight
            onClick={() => scroll(1)}
            aria-label="Scroll right"
          >
            ›
          </NavBtnRight>
        )}
      </RowContainer>
    </Wrap>
  );
}