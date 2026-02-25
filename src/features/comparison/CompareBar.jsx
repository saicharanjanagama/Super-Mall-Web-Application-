// src/features/comparison/CompareBar.jsx
import React from "react";
import styled, { keyframes } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCompare,
  clearCompare,
  selectCompareItems,
} from "./comparisonSlice";
import { Link } from "react-router-dom";

/* =============================
   Animations
============================= */

const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

/* =============================
   Styled Components
============================= */

const Bar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.92);
  border-top: 1px solid rgba(0, 0, 0, 0.08);

  padding: 14px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;

  box-shadow: 0 -6px 24px rgba(0, 0, 0, 0.08);
  animation: ${slideUp} 0.35s ease-out;
`;

const Items = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f7f9fc;
  padding: 6px 10px;
  border-radius: 8px;
  min-width: 160px;
`;

const Thumb = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
`;

const Name = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
`;

const RemoveBtn = styled.button`
  border: none;
  background: transparent;
  color: #d9534f;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    opacity: 0.7;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const CompareBtn = styled(Link)`
  background: linear-gradient(120deg, #0066ff, #00c6ff);
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 102, 255, 0.3);
  }
`;

const ClearBtn = styled.button`
  border: none;
  background: #eee;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #ddd;
  }
`;

/* =============================
   Component
============================= */

export default function CompareBar() {
  const items = useSelector(selectCompareItems);
  const dispatch = useDispatch();

  if (!items.length) return null;

  return (
    <Bar>
      <Items>
        {items.map((item) => (
          <Item key={item.id}>
            {item.imageUrl && (
              <Thumb src={item.imageUrl} alt={item.name} />
            )}
            <Name>{item.name}</Name>
            <RemoveBtn
              onClick={() => dispatch(removeFromCompare(item.id))}
            >
              ✕
            </RemoveBtn>
          </Item>
        ))}
      </Items>

      <Actions>
        <CompareBtn to="/compare">
          Compare Now ({items.length})
        </CompareBtn>

        <ClearBtn onClick={() => dispatch(clearCompare())}>
          Clear
        </ClearBtn>
      </Actions>
    </Bar>
  );
}