// src/features/shops/ShopForm.jsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  addShop,
  editShop,
  setEditingShop,
} from "./shopSlice";

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 24px;
  border-radius: ${({ theme }) => theme.radius};
  margin-bottom: 25px;
`;

const Title = styled.h3`
  margin-bottom: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 14px;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) =>
    theme.colors.border || "#ccc"};
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 14px;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) =>
    theme.colors.border || "#ccc"};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  height: 90px;
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) =>
    theme.colors.border || "#ccc"};
  margin-bottom: 14px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 18px;
  background: ${({ theme, $secondary }) =>
    $secondary ? "#6c757d" : theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`;

const ErrorText = styled.p`
  color: red;
  margin-bottom: 10px;
`;

export default function ShopForm() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  const {
    editingShop,
    createStatus,
    updateStatus,
    error,
  } = useSelector((s) => s.shops);

  const isCreating = createStatus === "loading";
  const isUpdating = updateStatus === "loading";
  const isLoading = isCreating || isUpdating;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [floor, setFloor] = useState("");
  const [description, setDescription] =
    useState("");

  /* ================= LOAD EDIT DATA ================= */
  useEffect(() => {
    if (editingShop) {
      setName(editingShop.name || "");
      setCategory(editingShop.category || "");
      setFloor(editingShop.floor || "");
      setDescription(
        editingShop.description || ""
      );
    }
  }, [editingShop]);

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setName("");
    setCategory("");
    setFloor("");
    setDescription("");
    dispatch(setEditingShop(null));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !category || !floor) {
      alert("Please fill all required fields");
      return;
    }

    const data = {
      name: name.trim(),
      category,
      floor,
      description: description.trim(),
    };

    if (editingShop) {
      dispatch(
        editShop({
          id: editingShop.id,
          updates: data,
        })
      );
    } else {
      dispatch(
        addShop({
          ...data,
          owner: user?.uid,
          status: "pending",
          createdAt: Date.now(),
        })
      );
    }

    resetForm();
  };

  /* ================= ACCESS CONTROL ================= */
  if (
    !user ||
    (user.role !== "merchant" &&
      user.role !== "admin")
  ) {
    return null;
  }

  return (
    <FormCard>
      <Title>
        {editingShop
          ? "Edit Shop"
          : "Add New Shop"}
      </Title>

      {error && <ErrorText>{error}</ErrorText>}

      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Shop Name *"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <Select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="">
            Select Category *
          </option>
          <option value="Clothing">
            Clothing
          </option>
          <option value="Electronics">
            Electronics
          </option>
          <option value="Food">
            Food
          </option>
          <option value="Jewellery">
            Jewellery
          </option>
          <option value="Sports">
            Sports
          </option>
        </Select>

        <Select
          value={floor}
          onChange={(e) =>
            setFloor(e.target.value)
          }
        >
          <option value="">
            Select Floor *
          </option>
          <option value="ground">
            Ground Floor
          </option>
          <option value="1">
            1st Floor
          </option>
          <option value="2">
            2nd Floor
          </option>
          <option value="3">
            3rd Floor
          </option>
        </Select>

        <TextArea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <ButtonRow>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isCreating && "Creating..."}
            {isUpdating && "Updating..."}
            {!isLoading &&
              (editingShop
                ? "Update Shop"
                : "Add Shop")}
          </Button>

          {editingShop && (
            <Button
              type="button"
              $secondary
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </ButtonRow>
      </form>
    </FormCard>
  );
}