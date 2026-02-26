// src/components/Home/Hero.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ===============================
   WRAPPER
================================ */
const Wrap = styled.section`
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  margin-bottom: 40px;
  min-height: 380px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.12);
`;

/* ===============================
   SLIDE AREA
================================ */
const SlideArea = styled.div`
  display: flex;
  height: 100%;
  transition: transform 600ms cubic-bezier(.22,.61,.36,1);
  transform: translateX(${(p) => p.offset}%);
  will-change: transform;
`;

/* ===============================
   SLIDE
================================ */
const Slide = styled.div`
  min-width: 100%;
  min-height: 380px;
  display: flex;
  align-items: center;
  padding: 60px 50px;
  color: white;
  background-size: cover;
  background-position: center;
  position: relative;
  background-image:
    linear-gradient(
      120deg,
      rgba(0,0,0,0.55),
      rgba(0,0,0,0.25)
    ),
    url(${(p) => p.bg});

  @media (max-width: 768px) {
    padding: 40px 24px;
    min-height: 320px;
  }
`;

/* ===============================
   CONTENT
================================ */
const Content = styled.div`
  max-width: 650px;
  animation: fadeUp 0.8s ease;

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  margin-bottom: 12px;
  line-height: 1.1;
  font-weight: 700;
`;

const Sub = styled.p`
  font-size: 1.05rem;
  margin-bottom: 22px;
  opacity: 0.95;
`;

const CTA = styled.button`
  padding: 12px 20px;
  border-radius: 10px;
  background: white;
  color: #0b4aa0;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
`;

/* ===============================
   CONTROLS
================================ */
const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.4);
  color: white;
  font-size: 18px;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: 0.2s ease;

  &:hover {
    background: rgba(0,0,0,0.65);
  }
`;

const ArrowLeft = styled(Arrow)`
  left: 18px;
`;

const ArrowRight = styled(Arrow)`
  right: 18px;
`;

/* ===============================
   DOTS
================================ */
const DotBar = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 18px;
  display: flex;
  gap: 10px;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: ${(p) =>
    p.active ? "white" : "rgba(255,255,255,0.5)"};
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

/* ===============================
   SLIDES DATA
================================ */
const slides = [
  {
    id: 1,
    bg: "/images/electronics.jpg",
    title: "Big Deals. Big Savings.",
    text: "Explore top deals across electronics, fashion & more.",
    link: "/search?q=deals",
  },
  {
    id: 2,
    bg: "/images/shop-clothing.avif",
    title: "Shop the Latest Trends",
    text: "Fresh arrivals from top brands every week.",
    link: "/search?q=latest",
  },
  {
    id: 3,
    bg: "/images/jewellery.jpg",
    title: "Exclusive Mall Offers",
    text: "Special discounts available only at SuperMall.",
    link: "/search?q=offers",
  },
];

/* ===============================
   COMPONENT
================================ */
export default function Hero({ interval = 5000 }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const touchStartX = useRef(0);
  const touchDelta = useRef(0);
  const intervalRef = useRef(null);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, []);

  /* AUTOPLAY */
  useEffect(() => {
    if (paused) return;

    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, interval);

    return () => clearInterval(intervalRef.current);
  }, [paused, interval]);

  /* KEYBOARD SUPPORT */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  /* TOUCH SUPPORT */
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const onTouchMove = (e) => {
    touchDelta.current =
      e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    if (Math.abs(touchDelta.current) > 60) {
      touchDelta.current > 0 ? prev() : next();
    }
    touchDelta.current = 0;
    setPaused(false);
  };

  return (
    <Wrap
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="Promotional Carousel"
    >
      <SlideArea offset={-index * 100}>
        {slides.map((s, i) => (
          <Slide key={s.id} bg={s.bg}>
            <Content>
              <Title>{s.title}</Title>
              <Sub>{s.text}</Sub>
              <CTA onClick={() => navigate(s.link)}>
                Explore Now
              </CTA>
            </Content>
          </Slide>
        ))}
      </SlideArea>

      <ArrowLeft onClick={prev} aria-label="Previous Slide">
        ◀
      </ArrowLeft>

      <ArrowRight onClick={next} aria-label="Next Slide">
        ▶
      </ArrowRight>

      <DotBar>
        {slides.map((_, i) => (
          <Dot
            key={i}
            active={i === index}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </DotBar>
    </Wrap>
  );
}