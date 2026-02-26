// src/features/offers/OfferList.jsx

import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOffers,
  removeOffer,
  setEditingOffer,
  selectOfferFetchStatus,
  selectOfferDeleteStatus,
  selectOffersByShop,
} from "./offerSlice";

/* =============================
   Styled Components
============================= */

const Wrapper = styled.div`
  margin-top: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 18px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Discount = styled.span`
  font-weight: bold;
  color: #00a651;
`;

const Description = styled.p`
  margin-top: 8px;
  opacity: 0.8;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;

  background: ${({ $expired }) =>
    $expired ? "#ffe6e6" : "#e6f4ff"};

  color: ${({ $expired }) =>
    $expired ? "#d93025" : "#0066ff"};
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: white;
  margin-left: 8px;

  background: ${({ $danger }) =>
    $danger ? "#ff4d4f" : "#0066ff"};

  &:hover {
    opacity: 0.85;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Empty = styled.p`
  opacity: 0.6;
  margin-top: 15px;
`;

/* =============================
   Component
============================= */

export default function OfferList({ shopId, ownerId }) {
  const dispatch = useDispatch();

  const fetchStatus = useSelector(selectOfferFetchStatus);
  const deleteStatus = useSelector(selectOfferDeleteStatus);

  const offers = useSelector(selectOffersByShop(shopId));
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    if (shopId) {
      dispatch(fetchOffers(shopId));
    }
  }, [dispatch, shopId]);

  if (fetchStatus === "loading")
    return <p>Loading offers...</p>;

  if (!offers.length)
    return <Empty>No offers yet.</Empty>;

  const isOwner =
    user?.role === "merchant" && user?.uid === ownerId;

  return (
    <Wrapper>
      {offers.map((o) => {
        const expired =
          o.expiry &&
          new Date(o.expiry) < new Date();

        const formattedExpiry = o.expiry
          ? new Date(o.expiry).toLocaleDateString()
          : null;

        return (
          <Card key={o.id}>
            <TitleRow>
              <div>
                <strong>{o.title}</strong>{" "}
                <Discount>
                  {o.discountType === "flat"
                    ? `₹${o.discount} OFF`
                    : `${o.discount}% OFF`}
                </Discount>
              </div>

              {formattedExpiry && (
                <Badge $expired={expired}>
                  {expired
                    ? "Expired"
                    : `Expires ${formattedExpiry}`}
                </Badge>
              )}
            </TitleRow>

            <Description>
              {o.description}
            </Description>

            {isOwner && (
              <div style={{ marginTop: 10 }}>
                <Button
                  onClick={() =>
                    dispatch(setEditingOffer(o))
                  }
                >
                  Edit
                </Button>

                <Button
                  $danger
                  disabled={
                    deleteStatus === "loading"
                  }
                  onClick={() =>
                    dispatch(removeOffer(o.id))
                  }
                >
                  {deleteStatus === "loading"
                    ? "Deleting..."
                    : "Delete"}
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </Wrapper>
  );
}