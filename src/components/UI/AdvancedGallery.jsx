// src/components/UI/AdvancedGallery.jsx
import React, { useState, useEffect, useRef } from "react";
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
  transition: 0.2s ease;

  &:hover {
    background: rgba(0,0,0,0.8);
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

const Thumb = styled.div`
  width: 78px;
  height: 78px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  border: 2px solid ${({ selected, theme }) =>
    selected ? theme.colors.primary : "transparent"};
  transition: 0.2s ease;

  &:hover {
    transform: scale(1.05);
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
`;

/* ===============================
   COMPONENT
================================ */

export default function AdvancedGallery({ images = [] }) {
  const imgs = images.length ? images : ["/placeholder.png"];

  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const next = () => setIndex((i) => (i + 1) % imgs.length);
  const prev = () => setIndex((i) => (i - 1 + imgs.length) % imgs.length);

  /* Keyboard navigation */
  useEffect(() => {
    const handleKey = (e) => {
      if (!fullscreen) return;

      if (e.key === "Escape") setFullscreen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [fullscreen]);

  /* Swipe support */
  const startX = useRef(0);
  const distX = useRef(0);

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    distX.current = e.touches[0].clientX - startX.current;
  };

  const onTouchEnd = () => {
    if (distX.current > 60) prev();
    else if (distX.current < -60) next();
    distX.current = 0;
  };

  const toggleZoom = () => {
    setZoom((z) => (z === 1 ? 2 : 1));
  };

  return (
    <Wrapper>
      {/* MAIN IMAGE */}
      <MainImageBox
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <MainImg
          src={imgs[index]}
          alt=""
          style={{ transform: `scale(${zoom})` }}
          onClick={() => setFullscreen(true)}
          onDoubleClick={toggleZoom}
        />

        {imgs.length > 1 && (
          <>
            <LeftArrow onClick={prev}>‹</LeftArrow>
            <RightArrow onClick={next}>›</RightArrow>
          </>
        )}

        <Counter>
          {index + 1} / {imgs.length}
        </Counter>
      </MainImageBox>

      {/* THUMBNAILS */}
      <ThumbsRow>
        {imgs.map((src, i) => (
          <Thumb
            key={i}
            selected={i === index}
            onClick={() => setIndex(i)}
          >
            <img src={src} alt="" />
          </Thumb>
        ))}
      </ThumbsRow>

      {/* FULLSCREEN VIEW */}
      {fullscreen && (
        <FullscreenOverlay onClick={() => setFullscreen(false)}>
          <CloseBtn onClick={() => setFullscreen(false)}>×</CloseBtn>

          <FullscreenImg
            src={imgs[index]}
            style={{ transform: `scale(${zoom})` }}
            onDoubleClick={toggleZoom}
          />
        </FullscreenOverlay>
      )}
    </Wrapper>
  );
}