// src/features/comparison/ComparePage.jsx

import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCompare,
  clearCompare,
  selectCompareItems,
} from "./comparisonSlice";

/* =============================
   Styled Components
============================= */

const Container = styled.div`
  padding: 30px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const ClearBtn = styled.button`
  background: linear-gradient(120deg, #0052cc, #007bff);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  margin-bottom: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 220px repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  min-width: 800px;
`;

const HeaderCell = styled.div`
  font-weight: bold;
  background: #f1f4f9;
  padding: 16px;
  border-radius: 10px;
  position: sticky;
  left: 0;
  z-index: 3;
  min-width: 220px;
`;

const Cell = styled.div`
  background: white;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  min-height: 70px;
  text-align: center;
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const RemoveBtn = styled.button`
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 8px;
  transition: 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
`;

const Highlight = styled.span`
  background: #e6f4ff;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  font-size: 18px;
  opacity: 0.7;
`;

/* =============================
   Component
============================= */

export default function ComparePage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCompareItems);

  /* =============================
     COMPUTE LOWEST PRICE
  ============================== */
  const lowestPrice = useMemo(() => {
    if (!items.length) return null;
    return Math.min(...items.map((p) => Number(p.price) || 0));
  }, [items]);

  /* =============================
     GET UNIQUE FEATURES (SAFE)
  ============================== */
  const allFeatures = useMemo(() => {
    return Array.from(
      new Set(
        items.flatMap((p) =>
          Array.isArray(p.features) ? p.features : []
        )
      )
    );
  }, [items]);

  /* =============================
     EARLY RETURN
  ============================== */
  if (items.length < 2) {
    return (
      <EmptyState>
        Select at least <strong>2 products</strong> to compare.
      </EmptyState>
    );
  }

  return (
    <Container>
      <Title>Product Comparison</Title>

      <ClearBtn onClick={() => dispatch(clearCompare())}>
        Clear All
      </ClearBtn>

      <TableWrapper>
        <Table>
          {/* IMAGE ROW */}
          <HeaderCell>Product</HeaderCell>
          {items.map((p) => (
            <Cell key={p.id}>
              <ProductCard>
                <Image
                  src={p.imageUrl || "/placeholder.png"}
                  alt={p.name}
                />
                <strong>{p.name}</strong>
                <RemoveBtn
                  onClick={() => dispatch(removeFromCompare(p.id))}
                >
                  Remove
                </RemoveBtn>
              </ProductCard>
            </Cell>
          ))}

          {/* PRICE ROW */}
          <HeaderCell>Price</HeaderCell>
          {items.map((p) => (
            <Cell key={`price-${p.id}`}>
              {p.price === lowestPrice ? (
                <Highlight>₹{p.price} 🔥 Best</Highlight>
              ) : (
                `₹${p.price}`
              )}
            </Cell>
          ))}

          {/* CATEGORY ROW */}
          <HeaderCell>Category</HeaderCell>
          {items.map((p) => (
            <Cell key={`cat-${p.id}`}>
              {p.category || "-"}
            </Cell>
          ))}

          {/* FEATURES ROWS */}
          {allFeatures.map((feature) => (
            <React.Fragment key={feature}>
              <HeaderCell>{feature}</HeaderCell>
              {items.map((p) => (
                <Cell key={`${p.id}-${feature}`}>
                  {p.features?.includes(feature) ? "✔️" : "—"}
                </Cell>
              ))}
            </React.Fragment>
          ))}
        </Table>
      </TableWrapper>
    </Container>
  );
}