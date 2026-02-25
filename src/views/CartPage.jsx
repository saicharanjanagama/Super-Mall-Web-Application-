// src/views/CartPage.jsx

import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  removeFromCart,
  decreaseQty,
  addToCart,
  clearCart,
} from "../features/cart/cartSlice";
import { createOrder } from "../features/orders/orderSlice";

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

const Item = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 20px;
  background: ${({ theme }) => theme.colors.surface};
  padding: 18px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const Img = styled.img`
  width: 130px;
  height: 110px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const QtyBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const RemoveBtn = styled.button`
  margin-top: 12px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  cursor: pointer;
`;

const Summary = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 25px;
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  position: sticky;
  top: 100px;
  height: fit-content;
`;

const CheckoutBtn = styled.button`
  width: 100%;
  margin-top: 15px;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items } = useSelector((s) => s.cart);
  const user = useSelector((s) => s.auth.user);

  const total = items.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to place order");
      return;
    }

    const order = {
      userId: user.uid,
      items,
      total,
      status: "Pending",
      createdAt: Date.now(),
    };

    try {
      await dispatch(createOrder({ order })).unwrap();
      dispatch(clearCart());
      navigate("/checkout");
    } catch (err) {
      alert("Failed to create order.");
    }
  };

  if (items.length === 0) {
    return (
      <Page>
        <EmptyState>
          <h2>Your cart is empty 🛒</h2>
          <p>Start shopping to add products.</p>
        </EmptyState>
      </Page>
    );
  }

  return (
    <Page>
      <h2>Your Cart</h2>

      <Layout>
        {/* LEFT SIDE — ITEMS */}
        <div>
          {items.map((item) => (
            <Item key={item.id}>
              <Img src={item.imageUrl} alt={item.name} />

              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                <QtyControls>
                  <QtyBtn
                    onClick={() =>
                      dispatch(decreaseQty(item.id))
                    }
                  >
                    −
                  </QtyBtn>

                  <strong>{item.qty}</strong>

                  <QtyBtn
                    onClick={() =>
                      dispatch(addToCart(item))
                    }
                  >
                    +
                  </QtyBtn>
                </QtyControls>

                <RemoveBtn
                  onClick={() => {
                    if (
                      window.confirm(
                        "Remove this item?"
                      )
                    ) {
                      dispatch(
                        removeFromCart(item.id)
                      );
                    }
                  }}
                >
                  Remove
                </RemoveBtn>
              </div>
            </Item>
          ))}
        </div>

        {/* RIGHT SIDE — SUMMARY */}
        <Summary>
          <h3>Order Summary</h3>

          <p>
            Subtotal: ₹
            {total.toLocaleString("en-IN")}
          </p>

          <p>Shipping: Free</p>

          <hr />

          <h3>
            Total: ₹
            {total.toLocaleString("en-IN")}
          </h3>

          <CheckoutBtn onClick={handleCheckout}>
            Proceed to Checkout
          </CheckoutBtn>
        </Summary>
      </Layout>
    </Page>
  );
}