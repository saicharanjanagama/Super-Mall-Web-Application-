// src/features/products/ProductForm.jsx

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  editProduct,
  setEditingProduct,
  selectProductStatus,
  selectProductError,
} from "./productSlice";

/* ============================
   Styled Components
============================ */

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 24px;
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  margin-bottom: 30px;
`;

const Title = styled.h3`
  margin-bottom: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  resize: vertical;
`;

const Button = styled.button`
  padding: 10px 18px;
  margin-top: 14px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelBtn = styled.button`
  margin-left: 10px;
  background: #ccc;
  color: #333;
`;

const Preview = styled.img`
  margin-top: 10px;
  width: 130px;
  height: 130px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius};
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 8px;
`;

/* ============================
   Component
============================ */

export default function ProductForm({ shopId }) {
  const dispatch = useDispatch();
  const editing = useSelector((s) => s.products.editingProduct);
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);

  const isLoading =
    status === "creating" || status === "updating";

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [features, setFeatures] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  /* ============================
     Load Editing Data
  ============================ */
  useEffect(() => {
    if (editing) {
      setName(editing.name || "");
      setPrice(editing.price || "");
      setCategory(editing.category || "");
      setFeatures(editing.features?.join(", ") || "");
      setPreview(editing.imageUrl || "");
    }
  }, [editing]);

  /* ============================
     Cleanup Object URL
  ============================ */
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* ============================
     Reset Form
  ============================ */
  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setFeatures("");
    setFile(null);
    setPreview("");
    dispatch(setEditingProduct(null));
  };

  /* ============================
     Submit
  ============================ */
  const submit = (e) => {
    e.preventDefault();

    if (!name || !price || !category) {
      alert("Please fill all required fields.");
      return;
    }

    const data = {
      name,
      price: Number(price),
      category,
      shopId,
      features: features
        ? features.split(",").map((f) => f.trim())
        : [],
    };

    if (editing) {
      dispatch(
        editProduct({
          id: editing.id,
          updates: data,
          file,
        })
      );
    } else {
      dispatch(addProduct({ data, file }));
    }

    resetForm();
  };

  return (
    <FormCard>
      <Title>
        {editing ? "Edit Product" : "Add Product"}
      </Title>

      <form onSubmit={submit}>
        <Input
          placeholder="Product Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Price *"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <Input
          placeholder="Category *"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <TextArea
          placeholder="Features (comma separated)"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
        />

        {/* File Upload */}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const selected = e.target.files[0];
            if (!selected) return;
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
          }}
        />

        {preview && <Preview src={preview} alt="Preview" />}

        {error && <ErrorText>{error}</ErrorText>}

        <div>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : editing
              ? "Update Product"
              : "Add Product"}
          </Button>

          {editing && (
            <CancelBtn
              type="button"
              onClick={resetForm}
            >
              Cancel
            </CancelBtn>
          )}
        </div>
      </form>
    </FormCard>
  );
}