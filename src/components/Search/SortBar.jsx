// src/components/Search/SortBar.jsx

import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setSort } from "../../features/search/searchSlice";

/* ===============================
   STYLES
================================ */

const Wrap = styled.div`
  margin: 10px 0 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

const Label = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0.7;
`;

const SortButton = styled.button`
  padding: 8px 14px;
  border-radius: 30px;
  border: 1px solid
    ${({ active, theme }) =>
      active ? theme.colors.primary : "#ddd"};
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : "#f9fafb"};
  color: ${({ active }) => (active ? "white" : "#444")};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ active }) =>
      active
        ? "0 8px 20px rgba(79,70,229,0.3)"
        : "0 6px 15px rgba(0,0,0,0.08)"};
  }
`;

/* ===============================
   COMPONENT
================================ */

export default function SortBar() {
  const dispatch = useDispatch();
  const sort = useSelector((s) => s.search.sortBy);

  const changeSort = (value) => {
    dispatch(setSort(value));
    // ✅ No applyFilters needed — selector auto recalculates
  };

  return (
    <Wrap>
      <Label>Sort By:</Label>

      <SortButton
        active={sort === "relevance"}
        onClick={() => changeSort("relevance")}
      >
        Relevance
      </SortButton>

      <SortButton
        active={sort === "price-asc"}
        onClick={() => changeSort("price-asc")}
      >
        Price ↑
      </SortButton>

      <SortButton
        active={sort === "price-desc"}
        onClick={() => changeSort("price-desc")}
      >
        Price ↓
      </SortButton>

      <SortButton
        active={sort === "rating"}
        onClick={() => changeSort("rating")}
      >
        Rating
      </SortButton>
    </Wrap>
  );
}