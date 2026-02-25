// src/features/products/ProductList.jsx

import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchProducts,
  removeProduct,
  setEditingProduct,
  selectAllProducts,
  selectProductStatus,
} from "./productSlice";

import { addToCompare } from "../comparison/comparisonSlice";
import {
  addWishlistItem,
  removeWishlistItem,
} from "../wishlist/wishlistSlice";

import { addToCart, syncCart } from "../cart/cartSlice";

import Stars from "../../components/UI/Stars";
import { getBestOffer, applyDiscount } from "../../utils/discount";

/* ============================
   Styled Components
============================ */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
  margin-top: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 18px;
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  transition: 0.18s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
  }
`;

const Img = styled.img`
  width: 100%;
  height: 170px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius};
  margin-bottom: 10px;
`;

const PriceRow = styled.div`
  margin-top: 6px;
  font-size: 1rem;
`;

const DiscountBadge = styled.div`
  align-self: flex-start;
  background: #f74242;
  color: white;
  padding: 3px 7px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const Actions = styled.div`
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Button = styled.button`
  padding: 7px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-size: 13px;
  background: ${({ $danger, $compare, $wish }) =>
    $danger
      ? "#d9534f"
      : $compare
      ? "#00a6ff"
      : $wish
      ? "#ff5fa2"
      : "#0275d8"};

  &:hover {
    opacity: 0.9;
  }
`;

/* ============================
   Component
============================ */

export default function ProductList({ shopId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductStatus);
  const wishlist = useSelector((s) => s.wishlist?.items || []);
  const offersByShop = useSelector((s) => s.offers?.offersByShop || {});
  const cartItems = useSelector((s) => s.cart?.items || []);
  const user = useSelector((s) => s.auth?.user);

  useEffect(() => {
    dispatch(fetchProducts(shopId));
  }, [dispatch, shopId]);

  /* ============================
     Add To Cart
  ============================ */
  const handleAddCart = (product) => {
    dispatch(addToCart(product));

    if (user) {
      const exists = cartItems.find((x) => x.id === product.id);
      const updatedCart = exists
        ? cartItems.map((x) =>
            x.id === product.id
              ? { ...x, qty: x.qty + 1 }
              : x
          )
        : [...cartItems, { ...product, qty: 1 }];

      dispatch(
        syncCart({
          userId: user.uid,
          items: updatedCart,
        })
      );
    }
  };

  /* ============================
     UI States
  ============================ */

  if (status === "loading") return <p>Loading products...</p>;
  if (!products.length) return <p>No products available.</p>;

  return (
    <>
      <h2>Products</h2>

      <Grid>
        {products.map((p) => {
          const isWishlisted = wishlist.includes(p.id);
          const shopOffers = offersByShop[p.shopId] || [];
          const bestOffer = getBestOffer(shopOffers);
          const discountedPrice = bestOffer
            ? applyDiscount(p.price, bestOffer)
            : null;

          return (
            <Card
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
            >
              {bestOffer && (
                <DiscountBadge>
                  {bestOffer.discount}% OFF
                </DiscountBadge>
              )}

              <Img
                src={p.imageUrl || "/placeholder.png"}
                alt={p.name}
              />

              <h3>{p.name}</h3>

              <Stars rating={p.avgRating || 0} size={16} />

              <PriceRow>
                {bestOffer ? (
                  <>
                    <b style={{ color: "green" }}>
                      ₹{discountedPrice}
                    </b>{" "}
                    <span
                      style={{
                        textDecoration: "line-through",
                        opacity: 0.6,
                        marginLeft: 6,
                      }}
                    >
                      ₹{p.price}
                    </span>
                  </>
                ) : (
                  <>₹{p.price}</>
                )}
              </PriceRow>

              <Actions>
                {/* Merchant Controls */}
                {user?.role === "merchant" && (
                  <>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setEditingProduct(p));
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      $danger
                      onClick={(e) => {
                        e.stopPropagation();
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
                  </>
                )}

                {/* Compare */}
                <Button
                  $compare
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(addToCompare(p));
                  }}
                >
                  Compare
                </Button>

                {/* Wishlist */}
                <Button
                  $wish={isWishlisted}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!user)
                      return alert("Login required");

                    if (isWishlisted)
                      dispatch(
                        removeWishlistItem({
                          userId: user.uid,
                          productId: p.id,
                        })
                      );
                    else
                      dispatch(
                        addWishlistItem({
                          userId: user.uid,
                          productId: p.id,
                        })
                      );
                  }}
                >
                  {isWishlisted
                    ? "❤️ Saved"
                    : "🤍 Wishlist"}
                </Button>

                {/* Add To Cart */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddCart(p);
                  }}
                >
                  🛒 Add to Cart
                </Button>
              </Actions>
            </Card>
          );
        })}
      </Grid>
    </>
  );
}