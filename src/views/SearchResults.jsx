// src/views/SearchResults.jsx

import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import {
  globalSearch,
  selectFilteredSearchResults
} from "../features/search/searchSlice";

import { addToCart, syncCart } from "../features/cart/cartSlice";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 30px 20px;
  max-width: 1100px;
  margin: auto;
`;

const Title = styled.h2`
  margin-bottom: 25px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 16px;
  transition: transform 0.15s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius};
  margin-bottom: 10px;
`;

const ItemTitle = styled.h3`
  margin: 6px 0;
  font-size: 17px;
`;

const TypeTag = styled.span`
  font-size: 13px;
  opacity: 0.6;
`;

const Button = styled.button`
  margin-top: auto;
  padding: 8px 14px;
  border: none;
  border-radius: ${({ theme }) => theme.radius};
  cursor: pointer;
  color: white;
  background: ${({ theme }) => theme.colors.primary};

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyState = styled.p`
  opacity: 0.7;
  margin-top: 20px;
`;

/* ===================== COMPONENT ===================== */

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const dispatch = useDispatch();

  // ✅ Use memoized selector (auto filter + sort)
  const results = useSelector(selectFilteredSearchResults);
  const status = useSelector((s) => s.search.status);
  const error = useSelector((s) => s.search.error);

  const cart = useSelector((s) => s.cart?.items || []);
  const user = useSelector((s) => s.auth?.user || null);

  /* ================= SEARCH TRIGGER ================= */

  useEffect(() => {
    if (query.trim()) {
      dispatch(globalSearch(query));
    }
  }, [query, dispatch]);

  /* ================= CART HANDLER ================= */

  const handleAddCart = (product) => {
    dispatch(addToCart(product));

    if (user) {
      dispatch(syncCart({ userId: user.uid, items: [...cart, product] }));
    }
  };

  /* ================= RENDER ================= */

  return (
    <Page>
      <Title>
        Search Results for: <strong>"{query}"</strong>
      </Title>

      {status === "loading" && (
        <EmptyState>Searching...</EmptyState>
      )}

      {status === "failed" && (
        <EmptyState style={{ color: "red" }}>
          {error || "Search failed"}
        </EmptyState>
      )}

      {status !== "loading" && results.length === 0 && (
        <EmptyState>No results found.</EmptyState>
      )}

      <Grid>
        {results.map((item) => (
          <Card key={item.id}>
            {item.image && (
              <Image src={item.image} alt={item.title} />
            )}

            <Link
              to={item.link}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ItemTitle>{item.title}</ItemTitle>
            </Link>

            <TypeTag>{item.type}</TypeTag>

            {item.type === "product" && (
              <Button onClick={() => handleAddCart(item.raw)}>
                🛒 Add to Cart
              </Button>
            )}
          </Card>
        ))}
      </Grid>
    </Page>
  );
}