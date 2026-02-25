// src/components/Search/FiltersPanel.jsx

import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setFilters } from "../../features/search/searchSlice";

/* ===============================
   STYLES
================================ */

const Panel = styled.div`
  padding: 24px;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 90px;
`;

const Title = styled.h3`
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 700;
`;

const Field = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  outline: none;
  transition: 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  outline: none;
  transition: 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s ease;
`;

const ApplyBtn = styled(Button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  margin-bottom: 10px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(79, 70, 229, 0.3);
  }
`;

const ClearBtn = styled(Button)`
  background: #f3f4f6;
  color: #444;

  &:hover {
    background: #e5e7eb;
  }
`;

/* ===============================
   COMPONENT
================================ */

export default function FiltersPanel() {
  const dispatch = useDispatch();

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [minRating, setMinRating] = useState(0);

  const apply = () => {
    dispatch(
      setFilters({
        minPrice: Number(minPrice),
        maxPrice: maxPrice ? Number(maxPrice) : Infinity,
        category,
        minRating: Number(minRating),
      })
    );
  };

  const clear = () => {
    setMinPrice(0);
    setMaxPrice("");
    setCategory("");
    setMinRating(0);

    dispatch(
      setFilters({
        minPrice: 0,
        maxPrice: Infinity,
        category: "",
        minRating: 0,
      })
    );
  };

  return (
    <Panel>
      <Title>Filters</Title>

      <Field>
        <Label>Category</Label>
        <Input
          type="text"
          placeholder="e.g. Electronics"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </Field>

      <Field>
        <Label>Minimum Price</Label>
        <Input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </Field>

      <Field>
        <Label>Maximum Price</Label>
        <Input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </Field>

      <Field>
        <Label>Minimum Rating</Label>
        <Select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="0">Any</option>
          <option value="1">1★ & up</option>
          <option value="2">2★ & up</option>
          <option value="3">3★ & up</option>
          <option value="4">4★ & up</option>
        </Select>
      </Field>

      <ApplyBtn onClick={apply}>Apply Filters</ApplyBtn>
      <ClearBtn onClick={clear}>Clear Filters</ClearBtn>
    </Panel>
  );
}