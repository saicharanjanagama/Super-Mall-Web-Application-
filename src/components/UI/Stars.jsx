import React, { useState } from "react";
import styled from "styled-components";

/* ===============================
   STYLES
================================ */

const StarWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const Star = styled.span`
  font-size: ${({ size }) => size}px;
  color: ${({ filled }) => (filled ? "#ffc107" : "#ddd")};
  cursor: ${({ clickable }) => (clickable ? "pointer" : "default")};
  transition: transform 0.15s ease, color 0.2s ease;

  &:hover {
    transform: ${({ clickable }) =>
      clickable ? "scale(1.2)" : "none"};
  }
`;

/* ===============================
   COMPONENT
================================ */

export default function Stars({
  rating = 0,
  size = 20,
  onChange = null,
}) {
  const [hovered, setHovered] = useState(null);

  const displayRating = hovered !== null ? hovered : rating;

  return (
    <StarWrapper>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(displayRating);

        return (
          <Star
            key={i}
            size={size}
            filled={filled}
            clickable={!!onChange}
            onMouseEnter={() => onChange && setHovered(i)}
            onMouseLeave={() => onChange && setHovered(null)}
            onClick={() => onChange && onChange(i)}
            role={onChange ? "button" : undefined}
            aria-label={onChange ? `Set ${i} stars` : undefined}
          >
            ★
          </Star>
        );
      })}
    </StarWrapper>
  );
}