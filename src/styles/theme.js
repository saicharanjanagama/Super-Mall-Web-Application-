// src/styles/theme.js

export const theme = {
  mode: "light", // change to "dark" if needed

  colors: {
    /* Core Brand */
    primary: "#6366f1",
    primaryHover: "#4f46e5",

    secondary: "#8b5cf6",
    accent: "#06b6d4",

    /* Status */
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",

    /* Backgrounds */
    background: "#f3f4f6",
    surface: "#ffffff",
    surfaceHover: "#f9fafb",

    /* Text */
    text: "#111827",
    textLight: "#6b7280",
    textMuted: "#9ca3af",

    /* Borders */
    border: "#e5e7eb",
    borderStrong: "#d1d5db",
  },

  /* Border Radius */
  radius: {
    sm: "6px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    round: "999px",
  },

  /* Shadows */
  shadow: {
    sm: "0 2px 6px rgba(0,0,0,0.06)",
    md: "0 6px 18px rgba(0,0,0,0.08)",
    lg: "0 15px 35px rgba(0,0,0,0.12)",
  },

  /* Typography */
  font: {
    family: "'Inter', sans-serif",

    size: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "22px",
      xxl: "28px",
    },

    weight: {
      normal: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
  },

  /* Spacing Scale */
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },

  /* Transition System */
  transition: {
    fast: "0.15s ease",
    normal: "0.3s ease",
    slow: "0.5s ease",
  },
};