// src/views/ProductDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../features/products/productSlice";
import {
  fetchReviews,
  postReview,
  removeReview,
} from "../features/reviews/reviewSlice";

import Stars from "../components/UI/Stars";
import AdvancedGallery from "../components/UI/AdvancedGallery";

import {
  addWishlistItem,
  removeWishlistItem,
} from "../features/wishlist/wishlistSlice";

import { addToCart, syncCart } from "../features/cart/cartSlice";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 30px 20px;
  max-width: 1200px;
  margin: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const InfoWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin-bottom: 6px;
`;

const Price = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  margin: 8px 0 12px;
`;

const Small = styled.p`
  margin: 6px 0;
  color: ${({ theme }) => theme.colors.muted};
`;

const Badge = styled.span`
  display: inline-block;
  background: #16a34a;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 10px;
`;

const ButtonRow = styled.div`
  margin-top: 18px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radius};
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: white;
  background: ${({ $danger, $wish, theme }) =>
    $danger
      ? theme.colors.danger
      : $wish
      ? "#ff5fa2"
      : theme.colors.primary};

  &:hover {
    opacity: 0.9;
  }
`;

const ReviewSection = styled.div`
  margin-top: 40px;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 90px;
  margin-top: 10px;
  padding: 10px;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) => theme.colors.muted}55;
  resize: none;
`;

const ReviewItem = styled.div`
  padding: 14px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.muted}22;

  &:last-child {
    border-bottom: none;
  }
`;

const LoadingText = styled.p`
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products = [] } = useSelector((s) => s.products || {});
  const { list: reviews = [] } = useSelector((s) => s.reviews || {});
  const wishlist = useSelector((s) => s.wishlist?.items || []);
  const cart = useSelector((s) => s.cart?.items || []);
  const user = useSelector((s) => s.auth?.user || null);

  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  if (!product)
    return (
      <Page>
        <LoadingText>Loading product...</LoadingText>
      </Page>
    );

  const images =
    product.images?.length
      ? product.images
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  const isWishlisted = wishlist.includes(productId);

  const submitReview = async () => {
    if (!user) return alert("Login required");
    if (!rating) return alert("Please select a rating");

    setSending(true);
    await dispatch(
      postReview({ productId, userId: user.uid, rating, comment })
    );
    setSending(false);
    setRating(0);
    setComment("");
  };

  const toggleWishlist = () => {
    if (!user) return navigate("/login");

    if (isWishlisted)
      dispatch(removeWishlistItem({ userId: user.uid, productId }));
    else dispatch(addWishlistItem({ userId: user.uid, product }));
  };

  const handleAddCart = () => {
    dispatch(addToCart(product));

    if (user) {
      dispatch(syncCart({ userId: user.uid, items: [...cart, product] }));
    }
  };

  return (
    <Page>
      <Grid>
        {/* -------- LEFT: GALLERY -------- */}
        <AdvancedGallery images={images} />

        {/* -------- RIGHT: INFO -------- */}
        <InfoWrap>
          <Title>{product.name}</Title>
          <Price>₹{product.price}</Price>

          <Badge>In Stock</Badge>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Stars rating={product.avgRating || 0} size={20} />
            <Small>{product.reviewCount || 0} reviews</Small>
          </div>

          <Small><b>Category:</b> {product.category}</Small>

          {product.features?.length > 0 && (
            <Small><b>Features:</b> {product.features.join(", ")}</Small>
          )}

          <ButtonRow>
            <Button onClick={handleAddCart}>
              🛒 Add to Cart
            </Button>

            <Button $wish={isWishlisted} onClick={toggleWishlist}>
              {isWishlisted ? "❤️ Saved" : "🤍 Wishlist"}
            </Button>
          </ButtonRow>

          {/* -------- REVIEWS -------- */}
          <ReviewSection>
            <h3>Customer Reviews</h3>

            {user ? (
              <>
                <Stars rating={rating} onChange={setRating} size={24} />
                <TextArea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                />
                <Button
                  style={{ marginTop: 10 }}
                  onClick={submitReview}
                  disabled={sending}
                >
                  {sending ? "Submitting…" : "Submit Review"}
                </Button>
              </>
            ) : (
              <Small>Login to write a review.</Small>
            )}

            {reviews.length === 0 ? (
              <Small>No reviews yet.</Small>
            ) : (
              reviews.map((r) => (
                <ReviewItem key={r.id}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Stars rating={r.rating} size={16} />
                    <Small>
                      {new Date(
                        r.createdAt?.seconds
                          ? r.createdAt.seconds * 1000
                          : r.createdAt
                      ).toLocaleString()}
                    </Small>
                  </div>
                  <p>{r.comment}</p>

                  {user?.uid === r.userId && (
                    <Button
                      $danger
                      onClick={() => dispatch(removeReview(r.id))}
                    >
                      Delete
                    </Button>
                  )}
                </ReviewItem>
              ))
            )}
          </ReviewSection>
        </InfoWrap>
      </Grid>
    </Page>
  );
}