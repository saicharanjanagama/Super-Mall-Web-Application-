// src/features/offers/OfferForm.jsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  createOffer,
  editOffer,
  setEditingOffer,
  selectOfferCreateStatus,
  selectOfferUpdateStatus,
  selectOfferError,
} from "./offerSlice";

/* =============================
   Styled Components
============================= */

const Card = styled.div`
  background: white;
  padding: 22px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  margin-bottom: 25px;
  max-width: 520px;
`;

const Title = styled.h3`
  margin-bottom: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 14px;
  resize: none;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  color: white;

  background: ${({ $danger }) =>
    $danger
      ? "#f44336"
      : "linear-gradient(120deg, #0066ff, #00c6ff)"};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Error = styled.p`
  color: red;
  margin-top: 10px;
`;

/* =============================
   Component
============================= */

export default function OfferForm({ shopId }) {
  const dispatch = useDispatch();
  const editing = useSelector((s) => s.offers.editingOffer);

  const createStatus = useSelector(selectOfferCreateStatus);
  const updateStatus = useSelector(selectOfferUpdateStatus);
  const error = useSelector(selectOfferError);

  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] =
    useState("percentage");
  const [description, setDescription] = useState("");
  const [expiry, setExpiry] = useState("");

  const isLoading =
    createStatus === "loading" ||
    updateStatus === "loading";

  /* =============================
     Prefill When Editing
  ============================== */
  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setDiscount(editing.discount || "");
      setDiscountType(
        editing.discountType || "percentage"
      );
      setDescription(editing.description || "");
      setExpiry(editing.expiry || "");
    }
  }, [editing]);

  /* =============================
     Submit Handler
  ============================== */
  const submit = async (e) => {
    e.preventDefault();

    if (!title || !discount) {
      alert("Title and discount are required");
      return;
    }

    const data = {
      title,
      discount: Number(discount),
      discountType,
      description,
      shopId,
      expiry: expiry || null,
    };

    let result;

    if (editing) {
      result = await dispatch(
        editOffer({ id: editing.id, updates: data })
      );
    } else {
      result = await dispatch(createOffer(data));
    }

    // Reset only if success
    if (result.meta.requestStatus === "fulfilled") {
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDiscount("");
    setDiscountType("percentage");
    setDescription("");
    setExpiry("");
    dispatch(setEditingOffer(null));
  };

  return (
    <Card>
      <Title>
        {editing ? "Edit Offer" : "Create New Offer"}
      </Title>

      <form onSubmit={submit}>
        <Input
          placeholder="Offer Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Row>
          <Input
            type="number"
            placeholder="Discount"
            value={discount}
            onChange={(e) =>
              setDiscount(e.target.value)
            }
          />

          <Select
            value={discountType}
            onChange={(e) =>
              setDiscountType(e.target.value)
            }
          >
            <option value="percentage">%</option>
            <option value="flat">Flat ₹</option>
          </Select>
        </Row>

        <Textarea
          placeholder="Offer Description"
          rows="3"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <Input
          type="date"
          value={expiry}
          onChange={(e) =>
            setExpiry(e.target.value)
          }
        />

        <Row>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? editing
                ? "Updating..."
                : "Creating..."
              : editing
              ? "Update Offer"
              : "Create Offer"}
          </Button>

          {editing && (
            <Button
              type="button"
              $danger
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </Row>

        {error && <Error>{error}</Error>}
      </form>
    </Card>
  );
}