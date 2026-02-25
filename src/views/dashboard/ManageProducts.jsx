// src/views/dashboard/ManageProducts.jsx

import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProducts,
  removeProduct,
  setEditingProduct,
} from "../../features/products/productSlice";

import {
  setSearch,
  setCategory,
  setMinPrice,
  setMaxPrice,
  setSort,
  resetFilters,
} from "../../features/products/productFiltersSlice";

import ProductForm from "../../features/products/ProductForm";
import { addToCompare } from "../../features/comparison/comparisonSlice";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 32px;
  max-width: 1200px;
  margin: auto;
`;

const Header = styled.div`
  margin-bottom: 25px;
`;

const Title = styled.h2`
  margin-bottom: 6px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 24px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  margin-bottom: 30px;
`;

const FilterBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 12px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 18px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: transform ${({ theme }) => theme.transition.fast};

  &:hover {
    transform: translateY(-4px);
  }
`;

const Img = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 7px 14px;
  margin-right: 8px;
  margin-top: 8px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  color: white;
  font-size: 13px;
  cursor: pointer;
  background: ${({ variant, theme }) =>
    variant === "danger"
      ? theme.colors.danger
      : variant === "compare"
      ? theme.colors.info
      : theme.colors.primary};

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyState = styled.div`
  padding: 50px 20px;
  text-align: center;
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function ManageProducts() {
  const dispatch = useDispatch();

  const { products = [], loading } = useSelector((s) => s.products);
  const filters = useSelector((s) => s.productFilters);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ================= FILTER + SORT ================= */

  const filtered = products
    .filter((p) =>
      p.name?.toLowerCase().includes(filters.search.toLowerCase())
    )
    .filter((p) =>
      filters.category ? p.category === filters.category : true
    )
    .filter((p) =>
      filters.minPrice ? p.price >= filters.minPrice : true
    )
    .filter((p) =>
      filters.maxPrice ? p.price <= filters.maxPrice : true
    )
    .sort((a, b) => {
      switch (filters.sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  /* ================= UI ================= */

  return (
    <Page>
      <Header>
        <Title>Manage Products</Title>
        <Subtitle>
          Add, edit, filter, and manage your shop products.
        </Subtitle>
      </Header>

      {/* ===== PRODUCT FORM ===== */}
      <SectionCard>
        <ProductForm />
      </SectionCard>

      {/* ===== FILTERS ===== */}
      <SectionCard>
        <FilterBar>
          <input
            placeholder="Search product"
            value={filters.search}
            onChange={(e) =>
              dispatch(setSearch(e.target.value))
            }
          />

          <select
            value={filters.category}
            onChange={(e) =>
              dispatch(setCategory(e.target.value))
            }
          >
            <option value="">All categories</option>
            <option value="Food">Food</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Beauty">Beauty</option>
          </select>

          <input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) =>
              dispatch(setMinPrice(Number(e.target.value)))
            }
          />

          <input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) =>
              dispatch(setMaxPrice(Number(e.target.value)))
            }
          />

          <select
            value={filters.sort}
            onChange={(e) =>
              dispatch(setSort(e.target.value))
            }
          >
            <option value="newest">Newest</option>
            <option value="price-asc">
              Price low → high
            </option>
            <option value="price-desc">
              Price high → low
            </option>
            <option value="name">Name A–Z</option>
          </select>

          <Button
            onClick={() => dispatch(resetFilters())}
          >
            Reset
          </Button>
        </FilterBar>
      </SectionCard>

      {/* ===== PRODUCT GRID ===== */}

      {loading ? (
        <p>Loading products...</p>
      ) : filtered.length === 0 ? (
        <EmptyState>
          No products match your filters.
        </EmptyState>
      ) : (
        <Grid>
          {filtered.map((p) => (
            <Card key={p.id}>
              {p.imageUrl && (
                <Img src={p.imageUrl} alt={p.name} />
              )}

              <h3>{p.name}</h3>
              <p>
                ₹{p.price?.toLocaleString("en-IN")}
              </p>
              <p>Category: {p.category}</p>

              <div>
                <Button
                  onClick={() =>
                    dispatch(setEditingProduct(p))
                  }
                >
                  Edit
                </Button>

                <Button
                  variant="danger"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Delete this product?"
                      )
                    ) {
                      dispatch(removeProduct(p.id));
                    }
                  }} 
                >
                  Delete
                </Button>

                <Button
                  variant="compare"
                  onClick={() =>
                    dispatch(addToCompare(p))
                  }
                >
                  Compare
                </Button>
              </div>
            </Card>
          ))}
        </Grid>
      )}
    </Page>
  );
}