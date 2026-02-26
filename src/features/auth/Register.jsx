// src/features/auth/Register.jsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthError } from "./authSlice";
import { Button } from "../../components/UI/Button";

/* ===============================
   STYLES
================================ */

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff, #f9fafb);
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  margin-bottom: 24px;
  text-align: center;
`;

const Field = styled.div`
  margin-bottom: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  outline: none;
  transition: 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  outline: none;
`;

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 10px;
`;

const SuccessText = styled.p`
  color: #16a34a;
  font-size: 0.9rem;
  margin-top: 10px;
  font-weight: 500;
`;

const InfoText = styled.p`
  margin-top: 18px;
  font-size: 0.8rem;
  opacity: 0.7;
  text-align: center;
`;

/* ===============================
   COMPONENT
================================ */

export default function Register() {
  const dispatch = useDispatch();
  const { registerStatus, error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);

  /* Clear previous errors */
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registerStatus === "loading") return;

    if (!name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setSuccess(false);

    const result = await dispatch(
      registerUser({
        email,
        password,
        profile: { name: name.trim() },
        role,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      setSuccess(true);
      setPassword(""); // clear password field
    }
  };

  return (
    <Page>
      <Card>
        <Title>Create Account</Title>

        <form onSubmit={handleSubmit}>
          <Field>
            <Input
              required
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field>
            <Input
              required
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field>
            <Input
              required
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Field>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={registerStatus === "loading"}
            >
              <option value="user">Customer</option>
              <option value="merchant">Merchant</option>
            </Select>
          </Field>

          <Button
            type="submit"
            disabled={registerStatus === "loading"}
            size="lg"
            style={{ width: "100%" }}
          >
            {registerStatus === "loading"
              ? "Registering..."
              : "Register"}
          </Button>
        </form>

        {error && <ErrorText>{error}</ErrorText>}

        {success && (
          <SuccessText>
            ✅ Registration successful! Please verify your email.
          </SuccessText>
        )}

        <InfoText>
          After registering, an email verification link will be sent.
          Please verify before accessing protected resources.
        </InfoText>
      </Card>
    </Page>
  );
}