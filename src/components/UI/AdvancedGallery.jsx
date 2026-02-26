// src/components/UI/AdvancedGallery.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";

/* ===============================
   STYLES
================================ */

const Wrapper = styled.div`
  width: 100%;
  user-select: none;
`;

const MainImageBox = styled.div`
  position: relative;
  width: 100%;
  height: 450px;
  overflow: hidden;
  border-radius: 16px;
  background: #f8f9fb;
  box-shadow: 0 20px 50px rgba(0,0,0,0.08);
`;

const MainImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  cursor: zoom-in;
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.5);
  color: white;
  font-size: 20px;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background: rgba(0,0,0,0.8);
  }

  &:focus-visible {
    outline: 3px solid white;
  }
`;

const LeftArrow = styled(Arrow)`
  left: 12px;
`;

const RightArrow = styled(Arrow)`
  right: 12px;
`;

const Counter = styled.div`
  position: absolute;
  bottom: 14px;
  right: 16px;
  background: rgba(0,0,0,0.6);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const ThumbsRow = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
`;

const Thumb = styled.button`
  width: 78px;
  height: 78px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : "transparent"};
  padding: 0;
  background: transparent;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
`;

const FullscreenImg = styled.img`
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
  transition: transform 0.3s ease;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 30px;
  right: 40px;
  font-size: 28px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid white;
  }
`;

/* ===============================
   COMPONENT
================================ */

export default function AdvancedGallery({ images = [], alt = "Product image" }) {
  const imgs = images.length ? images : ["/placeholder.png"];

  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % imgs.length),
    [imgs.length]
  );

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + imgs.length) % imgs.length),
    [imgs.length]
  );

  /* Keyboard navigation */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setFullscreen(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  /* Swipe support */
  const startX = useRef(0);

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const delta = e.changedTouches[0].clientX - startX.current;
    if (delta > 60) prev();
    else if (delta < -60) next();
  };

  const toggleZoom = () => {
    setZoom((z) => (z === 1 ? 2 : 1));
  };

  return (
    <Wrapper aria-label="Product Image Gallery">
      <MainImageBox
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <MainImg
          src={imgs[index]}
          alt={`${alt} ${index + 1}`}
          loading="lazy"
          style={{ transform: `scale(${zoom})` }}
          onClick={() => setFullscreen(true)}
          onDoubleClick={toggleZoom}
        />

        {imgs.length > 1 && (
          <>
            <LeftArrow onClick={prev} aria-label="Previous image">‹</LeftArrow>
            <RightArrow onClick={next} aria-label="Next image">›</RightArrow>
          </>
        )}

        <Counter>
          {index + 1} / {imgs.length}
        </Counter>
      </MainImageBox>

      <ThumbsRow>
        {imgs.map((src, i) => (
          <Thumb
            key={i}
            $selected={i === index}
            onClick={() => setIndex(i)}
            aria-label={`View image ${i + 1}`}
          >
            <img src={src} alt="" loading="lazy" />
          </Thumb>
        ))}
      </ThumbsRow>

      {fullscreen && (
        <FullscreenOverlay
          role="dialog"
          aria-modal="true"
          onClick={() => setFullscreen(false)}
        >
          <CloseBtn onClick={() => setFullscreen(false)} aria-label="Close">
            ×
          </CloseBtn>

          <FullscreenImg
            src={imgs[index]}
            alt={`${alt} fullscreen`}
            style={{ transform: `scale(${zoom})` }}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={toggleZoom}
          />
        </FullscreenOverlay>
      )}
    </Wrapper>
  );
}