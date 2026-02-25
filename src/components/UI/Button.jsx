import styled, { css } from "styled-components";

/* ===============================
   VARIANTS
================================ */

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: white;
  `,
  outline: css`
    background: transparent;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
  `,
};

const sizes = {
  sm: css`
    padding: 6px 12px;
    font-size: 0.8rem;
  `,
  md: css`
    padding: 10px 18px;
    font-size: 0.9rem;
  `,
  lg: css`
    padding: 14px 24px;
    font-size: 1rem;
  `,
};

export const Button = styled.button`
  border-radius: ${({ theme }) => theme.radius || "12px"};
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;

  ${({ variant = "primary" }) => variants[variant]}
  ${({ size = "md" }) => sizes[size]}

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.96);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;