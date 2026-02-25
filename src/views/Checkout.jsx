// src/views/Checkout.jsx

import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../features/orders/orderSlice";
import { clearCart, syncCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 40px;
  max-width: 1100px;
  margin: auto;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 25px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
`;

const SectionTitle = styled.h3`
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const RadioBox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Preview = styled.img`
  width: 160px;
  margin-top: 10px;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

/* ===================== COMPONENT ===================== */

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((s) => s.cart.items || []);
  const user = useSelector((s) => s.auth.user);

  const [method, setMethod] = useState("cod");
  const [file, setFile] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, i) => sum + i.price * (i.qty || 1),
        0
      ),
    [cart]
  );

  const handleOrder = async () => {
    if (!user) {
      alert("Login first!");
      return;
    }

    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    if (method === "upi" && !file) {
      alert("Upload UPI payment screenshot");
      return;
    }

    try {
      setLoading(true);

      const order = {
        userId: user.uid,
        items: cart,
        total,
        address,
        method: method === "cod" ? "COD" : "UPI",
        status:
          method === "cod"
            ? "Pending"
            : "Awaiting Verification",
        createdAt: Date.now(),
      };

      await dispatch(
        createOrder({
          order,
          paymentProofFile: file,
        })
      ).unwrap();

      dispatch(clearCart());
      dispatch(
        syncCart({ userId: user.uid, items: [] })
      );

      navigate("/order-success");
    } catch (err) {
      alert("Order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Page>
        <h2>Your cart is empty.</h2>
      </Page>
    );
  }

  return (
    <Page>
      <h2>Checkout</h2>

      <Layout>
        {/* LEFT SIDE */}
        <Card>
          <SectionTitle>Delivery Details</SectionTitle>

          <Input
            placeholder="Delivery Address"
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
          />

          <SectionTitle>
            Payment Method
          </SectionTitle>

          <RadioBox>
            <input
              type="radio"
              checked={method === "cod"}
              onChange={() => setMethod("cod")}
            />
            Cash on Delivery (COD)
          </RadioBox>

          <RadioBox>
            <input
              type="radio"
              checked={method === "upi"}
              onChange={() => setMethod("upi")}
            />
            UPI (Upload Screenshot)
          </RadioBox>

          {method === "upi" && (
            <>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
              />

              {file && (
                <Preview
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                />
              )}
            </>
          )}
        </Card>

        {/* RIGHT SIDE — SUMMARY */}
        <Card>
          <SectionTitle>
            Order Summary
          </SectionTitle>

          {cart.map((i) => (
            <ItemRow key={i.id}>
              <span>
                {i.name} × {i.qty}
              </span>
              <span>
                ₹
                {(i.price * i.qty).toLocaleString(
                  "en-IN"
                )}
              </span>
            </ItemRow>
          ))}

          <hr />

          <ItemRow>
            <strong>Total</strong>
            <strong>
              ₹
              {total.toLocaleString("en-IN")}
            </strong>
          </ItemRow>

          <Button
            onClick={handleOrder}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "Place Order"}
          </Button>
        </Card>
      </Layout>
    </Page>
  );
}