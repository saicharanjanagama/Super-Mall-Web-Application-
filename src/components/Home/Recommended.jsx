// src/components/Home/Recommended.jsx
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ============================
   WRAPPER
============================ */
const Section = styled.section`
  margin-top: 60px;
`;

const Title = styled.h2`
  margin-bottom: 24px;
  font-size: 1.5rem;
  font-weight: 700;
`;

/* ============================
   GRID
============================ */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 22px;
`;

/* ============================
   CARD
============================ */
const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.18);
  }
`;

/* ============================
   IMAGE
============================ */
const ImgWrap = styled.div`
  height: 180px;
  overflow: hidden;
  position: relative;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

/* Discount badge */
const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 5px 8px;
  border-radius: 6px;
  font-weight: 600;
`;

/* ============================
   CONTENT
============================ */
const Content = styled.div`
  padding: 16px;
`;

const Name = styled.h3`
  font-size: 1rem;
  margin-bottom: 6px;
  font-weight: 600;
`;

const Price = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 6px;
`;

const Rating = styled.div`
  font-size: 0.85rem;
  color: #f59e0b;
  margin-bottom: 10px;
`;

/* ============================
   BUTTON
============================ */
const AddBtn = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  transition: 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
  }
`;

/* ============================
   COMPONENT
============================ */
export default function Recommended({ products = [], addToCart }) {
  const navigate = useNavigate();

  return (
    <Section>
      <Title>Recommended For You</Title>

      <Grid>
        {products.slice(0, 8).map((p) => (
          <Card
            key={p.id}
            onClick={() => navigate(`/product/${p.id}`)}
          >
            <ImgWrap>
              {p.imageUrl && <Img src={p.imageUrl} alt={p.name} />}
              {p.discount && <Badge>{p.discount}% OFF</Badge>}
            </ImgWrap>

            <Content>
              <Name>{p.name}</Name>

              <Price>₹{p.price}</Price>

              {p.avgRating && (
                <Rating>
                  ⭐ {p.avgRating.toFixed(1)} ({p.reviewCount || 0})
                </Rating>
              )}

              <AddBtn
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(
                    {
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      imageUrl: p.imageUrl,
                    },
                    e
                  );
                }}
              >
                🛒 Add to Cart
              </AddBtn>
            </Content>
          </Card>
        ))}
      </Grid>
    </Section>
  );
}