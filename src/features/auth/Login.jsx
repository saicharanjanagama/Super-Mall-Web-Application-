// src/features/auth/Login.jsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  sendPasswordReset,
  clearAuthError,
} from "./authSlice";
import { Link, useNavigate } from "react-router-dom";
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

const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 10px;
`;

const ResetLink = styled.button`
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BottomText = styled.p`
  margin-top: 18px;
  font-size: 0.85rem;
  text-align: center;
`;

/* ===============================
   COMPONENT
================================ */

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loginStatus, resetStatus, error, user } = useSelector(
    (s) => s.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* Clear error on mount */
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  /* Redirect after login */
  useEffect(() => {
    if (!user?.uid || !user?.role) return;

    if (user.role === "admin") navigate("/admin");
    else if (user.role === "merchant") navigate("/dashboard");
    else navigate("/");
  }, [user, navigate]);

  const submit = (e) => {
    e.preventDefault();

    if (loginStatus === "loading") return;

    dispatch(loginUser({ email, password }));
  };

  const onReset = async () => {
    if (!email) {
      alert("Enter your email first.");
      return;
    }

    const result = await dispatch(sendPasswordReset({ email }));

    if (result.meta.requestStatus === "fulfilled") {
      alert("Password reset link sent to your email.");
    }
  };

  return (
    <Page>
      <Card>
        <Title>Welcome Back</Title>

        <form onSubmit={submit}>
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Button
            type="submit"
            disabled={loginStatus === "loading"}
            size="lg"
            style={{ width: "100%" }}
          >
            {loginStatus === "loading"
              ? "Logging in..."
              : "Login"}
          </Button>
        </form>

        {error && <ErrorText>{error}</ErrorText>}

        <ResetLink
          onClick={onReset}
          disabled={resetStatus === "loading"}
        >
          {resetStatus === "loading"
            ? "Sending reset..."
            : "Forgot password?"}
        </ResetLink>

        <BottomText>
          Don’t have an account?{" "}
          <Link to="/register">Register</Link>
        </BottomText>
      </Card>
    </Page>
  );
}