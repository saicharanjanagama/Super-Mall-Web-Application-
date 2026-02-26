// src/features/reviews/ProductReviews.jsx

import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchReviews,
  postReview,
  removeReview,
  selectReviewsByProduct,
  selectReviewStatus,
  selectReviewError,
} from "./reviewsSlice";

import Stars from "../../components/UI/Stars";

/* ============================
   Styled Components
============================ */

const Wrapper = styled.div`
  margin-top: 40px;
`;

const Title = styled.h3`
  font-weight: 600;
  font-size: 22px;
  margin-bottom: 20px;
`;

const ReviewCard = styled.div`
  padding: 14px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: vertical;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${({ danger }) =>
    danger ? "#d9534f" : "#0275d8"};
  color: white;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 8px;
`;

/* ============================
   Component
============================ */

export default function ProductReviews({ productId }) {
  const dispatch = useDispatch();

  const reviews = useSelector(
    selectReviewsByProduct(productId)
  );

  const status = useSelector(
    selectReviewStatus(productId)
  );

  const error = useSelector(
    selectReviewError(productId)
  );

  const user = useSelector((s) => s.auth.user);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const isPosting = status === "posting";
  const isLoading = status === "loading";

  /* ============================
     Fetch Reviews
  ============================ */
  useEffect(() => {
    if (productId) {
      dispatch(fetchReviews(productId));
    }
  }, [dispatch, productId]);

  /* ============================
     Prevent Multiple Reviews
  ============================ */
  const alreadyReviewed = useMemo(() => {
    if (!user) return false;
    return reviews.some(
      (r) => r.userId === user.uid
    );
  }, [reviews, user]);

  /* ============================
     Submit Review
  ============================ */
  const submit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to post a review.");
      return;
    }

    if (alreadyReviewed) {
      alert("You have already reviewed this product.");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a review comment.");
      return;
    }

    dispatch(
      postReview({
        productId,
        userId: user.uid,
        rating,
        comment: comment.trim(),
      })
    );

    setComment("");
    setRating(5);
  };

  return (
    <Wrapper>
      <Title>Reviews</Title>

      {/* ================= Add Review ================= */}
      {user && (
        <form
          onSubmit={submit}
          style={{ marginBottom: 25 }}
        >
          <Stars
            rating={rating}
            size={22}
            onChange={(val) => setRating(val)}
          />

          <TextArea
            rows={3}
            placeholder={
              alreadyReviewed
                ? "You already reviewed this product."
                : "Write your review..."
            }
            value={comment}
            disabled={alreadyReviewed}
            onChange={(e) =>
              setComment(e.target.value)
            }
          />

          {!alreadyReviewed && (
            <Button
              type="submit"
              disabled={isPosting}
            >
              {isPosting
                ? "Posting..."
                : "Submit Review"}
            </Button>
          )}

          {error && <ErrorText>{error}</ErrorText>}
        </form>
      )}

      {/* ================= Review List ================= */}
      {isLoading && <p>Loading reviews...</p>}

      {!isLoading && reviews.length === 0 && (
        <p>No reviews yet. Be the first to review!</p>
      )}

      {reviews.map((r) => (
        <ReviewCard key={r.id}>
          <Stars rating={r.rating} size={16} />

          <p style={{ marginTop: 6 }}>
            {r.comment}
          </p>

          {(user &&
            (user.uid === r.userId ||
              user.role === "admin")) && (
            <Button
              danger
              onClick={() =>
                dispatch(
                  removeReview({
                    id: r.id,
                    productId,
                  })
                )
              }
            >
              Delete
            </Button>
          )}
        </ReviewCard>
      ))}
    </Wrapper>
  );
}