// src/features/shops/ShopFilters.jsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setShopFilters } from "./shopSlice";

/* ---------------- Styled ---------------- */

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 25px;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  min-width: 220px;
`;

const Select = styled.select`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

export default function ShopFilters() {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.shops.filters);

  const [searchInput, setSearchInput] = useState(
    filters.search || ""
  );

  /* ================= Sync Redux → Local ================= */
  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  /* ================= Debounced Search ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        dispatch(
          setShopFilters({
            search: searchInput,
          })
        );
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, dispatch]);

  /* ================= Reset Filters ================= */
  const resetFilters = () => {
    setSearchInput("");

    dispatch(
      setShopFilters({
        search: "",
        category: "",
        floor: "",
      })
    );
  };

  return (
    <Wrapper>
      <Input
        placeholder="Search shop by name"
        value={searchInput}
        onChange={(e) =>
          setSearchInput(e.target.value)
        }
      />

      <Select
        value={filters.category || ""}
        onChange={(e) =>
          dispatch(
            setShopFilters({
              category: e.target.value,
            })
          )
        }
      >
        <option value="">All Categories</option>
        <option value="Clothing">Clothing</option>
        <option value="Electronics">Electronics</option>
        <option value="Food">Food</option>
        <option value="Jewellery">Jewellery</option>
        <option value="Sports">Sports</option>
      </Select>

      <Select
        value={filters.floor || ""}
        onChange={(e) =>
          dispatch(
            setShopFilters({
              floor: e.target.value,
            })
          )
        }
      >
        <option value="">All Floors</option>
        <option value="ground">Ground Floor</option>
        <option value="1">1st Floor</option>
        <option value="2">2nd Floor</option>
        <option value="3">3rd Floor</option>
      </Select>

      <Button onClick={resetFilters}>
        Clear Filters
      </Button>
    </Wrapper>
  );
}