// src/features/shops/ShopList.jsx

import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShops,
  removeShop,
  setEditingShop,
  setShopFilters,
  selectFilteredShops,
  selectShopStatus,
  selectShopError,
} from "./shopSlice";
import { Link } from "react-router-dom";

/* ---------------- Styled Components ---------------- */

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  margin-bottom: 15px;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;

  input,
  select {
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    font-size: 14px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const ShopName = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const Info = styled.p`
  margin: 4px 0;
  opacity: 0.85;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: ${({ status }) =>
    status === "approved"
      ? "#28a745"
      : status === "rejected"
      ? "#dc3545"
      : "#ffc107"};
`;

const Button = styled.button`
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background-color: ${({ danger, theme }) =>
    danger ? "#dc3545" : theme.colors.primary};
  color: white;
  margin-right: 10px;

  &:hover {
    opacity: 0.9;
  }
`;

const DetailLink = styled(Link)`
  display: inline-block;
  margin-top: 8px;
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

/* ---------------- Helper ---------------- */

const getFloorLabel = (floor) => {
  switch (floor) {
    case "ground":
    case "0":
      return "Ground Floor";
    case "1":
      return "1st Floor";
    case "2":
      return "2nd Floor";
    case "3":
      return "3rd Floor";
    default:
      return floor;
  }
};

/* ---------------- Component ---------------- */

export default function ShopList() {
  const dispatch = useDispatch();

  const shops = useSelector(selectFilteredShops);
  const { fetch } = useSelector(selectShopStatus);
  const error = useSelector(selectShopError);
  const filters = useSelector((s) => s.shops.filters);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  return (
    <Container>
      <Title>Shops</Title>

      {/* ---------------- FILTERS ---------------- */}
      <Filters>
        <input
          placeholder="Search shop by name"
          value={filters.search}
          onChange={(e) =>
            dispatch(
              setShopFilters({
                search: e.target.value,
              })
            )
          }
        />

        <select
          value={filters.category}
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
        </select>

        <select
          value={filters.floor}
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
        </select>
      </Filters>

      {/* ---------------- STATUS ---------------- */}
      {fetch === "loading" && <p>Loading shops...</p>}

      {fetch === "failed" && (
        <p style={{ color: "red" }}>
          {error || "Something went wrong"}
        </p>
      )}

      {fetch === "idle" && shops.length === 0 && (
        <p style={{ opacity: 0.7 }}>
          No shops match your filters.
        </p>
      )}

      {/* ---------------- SHOP CARDS ---------------- */}
      <Grid>
        {shops.map((shop) => (
          <Card key={shop.id}>
            <ShopName>
              {shop.name}{" "}
              {shop.status && (
                <Badge status={shop.status}>
                  {shop.status}
                </Badge>
              )}
            </ShopName>

            <Info>Category: {shop.category}</Info>
            <Info>
              Floor: {getFloorLabel(shop.floor)}
            </Info>
            <Info>{shop.description}</Info>

            <div style={{ marginTop: 12 }}>
              {(user?.uid === shop.owner ||
                user?.role === "admin") && (
                <>
                  <Button
                    onClick={() =>
                      dispatch(setEditingShop(shop))
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    danger
                    onClick={() => {
                      if (
                        window.confirm(
                          "Delete this shop?"
                        )
                      ) {
                        dispatch(removeShop(shop.id));
                      }
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}

              <DetailLink
                to={`/shops/${shop.id}`}
              >
                View Details →
              </DetailLink>
            </div>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}