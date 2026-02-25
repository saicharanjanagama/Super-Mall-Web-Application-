// src/views/WishlistPage.jsx

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { addToCart, syncCart } from "../features/cart/cartSlice";
import { removeWishlistItem } from "../features/wishlist/wishlistSlice";

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
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease;

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

const Name = styled.h3`
  font-size: 17px;
  margin: 6px 0;
`;

const Price = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const ButtonRow = styled.div`
  margin-top: auto;
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  flex: 1;
  padding: 8px 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radius};
  cursor: pointer;
  color: white;
  font-size: 14px;
  background: ${({ $danger, theme }) =>
    $danger ? theme.colors.danger : theme.colors.primary};

  &:hover {
    opacity: 0.9;
  }
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function WishlistPage() {
  const dispatch = useDispatch();

  const { items = [] } = useSelector((s) => s.wishlist || {});
  const { products = [] } = useSelector((s) => s.products || {});
  const user = useSelector((s) => s.auth?.user || null);
  const cart = useSelector((s) => s.cart?.items || []);

  const wishlistProducts = products.filter((p) =>
    items.includes(p.id)
  );

  const addCart = (product) => {
    dispatch(addToCart(product));

    if (user) {
      dispatch(
        syncCart({ userId: user.uid, items: [...cart, product] })
      );
    }
  };

  if (wishlistProducts.length === 0)
    return (
      <Page>
        <EmptyState>
          <h3>No favorites yet 💔</h3>
          <p>Browse products and add items to your wishlist.</p>
          <Link to="/">Go Shopping →</Link>
        </EmptyState>
      </Page>
    );

  return (
    <Page>
      <Title>Your Wishlist ❤️</Title>

      <Grid>
        {wishlistProducts.map((p) => (
          <Card key={p.id}>
            {p.imageUrl && (
              <Image src={p.imageUrl} alt={p.name} />
            )}

            <Link
              to={`/product/${p.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Name>{p.name}</Name>
            </Link>

            <Price>₹{p.price}</Price>

            <ButtonRow>
              <Button onClick={() => addCart(p)}>
                🛒 Add
              </Button>

              <Button
                $danger
                onClick={() =>
                  dispatch(
                    removeWishlistItem({
                      userId: user?.uid,
                      productId: p.id,
                    })
                  )
                }
              >
                Remove
              </Button>
            </ButtonRow>
          </Card>
        ))}
      </Grid>
    </Page>
  );
}