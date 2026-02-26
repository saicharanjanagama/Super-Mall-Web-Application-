// src/features/products/FiltersBar.jsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Range } from "react-range";
import { useDispatch, useSelector } from "react-redux";
import {
  setMinPrice,
  setMaxPrice,
  setSort,
  toggleCategory,
  setSearch,
  setMinRating,
  setInStockOnly,
  selectFilters,
} from "./productFilterSlice";

/* ============================
   Styled Components
============================ */

const Bar = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
  flex-wrap: wrap;
  padding: 14px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ddd;
`;

const Label = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.lightText};
`;

const CategoryBtn = styled.button`
  padding: 6px 10px;
  border-radius: 20px;
  border: 1px solid
    ${({ $active }) => ($active ? "#4f46e5" : "#ddd")};
  background: ${({ $active }) =>
    $active ? "#4f46e5" : "#fff"};
  color: ${({ $active }) =>
    $active ? "#fff" : "#333"};
  cursor: pointer;
  font-size: 13px;
`;

const PriceBox = styled.div`
  width: 280px;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
`;

/* ============================
   Component
============================ */

export default function FiltersBar() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  const MAX_PRICE = 100000;

  const [values, setValues] = useState([
    filters.minPrice,
    filters.maxPrice === Infinity
      ? MAX_PRICE
      : filters.maxPrice,
  ]);

  useEffect(() => {
    setValues([
      filters.minPrice,
      filters.maxPrice === Infinity
        ? MAX_PRICE
        : filters.maxPrice,
    ]);
  }, [filters.minPrice, filters.maxPrice]);

  const categories = [
    "Clothing",
    "Electronics",
    "Food",
    "Jewellery",
    "Shoes",
    "Home",
  ];

  return (
    <Bar>
      {/* SEARCH */}
      <Label>Search</Label>
      <Input
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) =>
          dispatch(setSearch(e.target.value))
        }
      />

      {/* SORT */}
      <Label>Sort</Label>
      <Select
        value={filters.sort}
        onChange={(e) =>
          dispatch(setSort(e.target.value))
        }
      >
        <option value="newest">Newest</option>
        <option value="price-asc">
          Price: Low → High
        </option>
        <option value="price-desc">
          Price: High → Low
        </option>
        <option value="name">Name A → Z</option>
        <option value="rating">Rating</option>
      </Select>

      {/* CATEGORY */}
      <Label>Category</Label>
      {categories.map((cat) => (
        <CategoryBtn
          key={cat}
          $active={filters.categories.includes(cat)}
          onClick={() =>
            dispatch(toggleCategory(cat))
          }
        >
          {cat}
        </CategoryBtn>
      ))}

      {/* RATING */}
      <Label>Min Rating</Label>
      <Select
        value={filters.minRating}
        onChange={(e) =>
          dispatch(setMinRating(e.target.value))
        }
      >
        <option value={0}>All</option>
        <option value={3}>3★+</option>
        <option value={4}>4★+</option>
        <option value={4.5}>4.5★+</option>
      </Select>

      {/* IN STOCK */}
      <Label>
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) =>
            dispatch(
              setInStockOnly(e.target.checked)
            )
          }
        />{" "}
        In Stock Only
      </Label>

      {/* PRICE RANGE */}
      <Label>Price</Label>
      <PriceBox>
        <Range
          step={100}
          min={0}
          max={MAX_PRICE}
          values={values}
          onChange={(vals) => setValues(vals)}
          onFinalChange={(vals) => {
            dispatch(setMinPrice(vals[0]));
            dispatch(setMaxPrice(vals[1]));
          }}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: 6,
                background: "#e5e7eb",
                borderRadius: 6,
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: 18,
                width: 18,
                borderRadius: 9,
                background: "#4f46e5",
              }}
            />
          )}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            marginTop: 8,
          }}
        >
          <span>₹{values[0]}</span>
          <span>₹{values[1]}</span>
        </div>
      </PriceBox>
    </Bar>
  );
}