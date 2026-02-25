// src/utils/validators.js

/* =====================================================
   EMAIL VALIDATION
===================================================== */

export function isEmail(email, { strict = false } = {}) {
  if (!email || typeof email !== "string") return false;

  const value = email.trim();

  // RFC max email length
  if (value.length > 254) return false;

  // Basic safe pattern
  const basicPattern =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!basicPattern.test(value)) return false;

  if (strict) {
    const [local, domain] = value.split("@");

    // Local part max 64 chars
    if (local.length > 64) return false;

    // Domain max 255 chars
    if (domain.length > 255) return false;

    // Prevent consecutive dots
    if (value.includes("..")) return false;
  }

  return true;
}


/* =====================================================
   PASSWORD VALIDATION (BONUS)
===================================================== */

export function isStrongPassword(password) {
  if (!password || typeof password !== "string") return false;

  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&        // Uppercase
    /[a-z]/.test(password) &&        // Lowercase
    /\d/.test(password) &&           // Number
    /[@$!%*?&]/.test(password)      // Special character
  );
}


/* =====================================================
   REQUIRED FIELD CHECK
===================================================== */

export function isRequired(value) {
  return value !== undefined &&
         value !== null &&
         String(value).trim() !== "";
}