// src/utils/discount.js

/* =====================================================
   GET BEST OFFER
===================================================== */
export function getBestOffer(offers = []) {
  if (!Array.isArray(offers) || offers.length === 0) {
    return null;
  }

  return offers.reduce((best, current) => {
    const bestValue = best?.discount || 0;
    const currentValue = current?.discount || 0;

    return currentValue > bestValue ? current : best;
  }, null);
}


/* =====================================================
   APPLY DISCOUNT
   Supports:
   - percentage (<=100)
   - flat discount (>100 or type === "flat")
===================================================== */
export function applyDiscount(price, offer) {
  if (!offer || typeof price !== "number") {
    return safeRound(price || 0);
  }

  let finalPrice = price;

  const discount = Number(offer.discount) || 0;

  if (discount <= 0) return safeRound(price);

  // Percentage discount
  if (discount <= 100) {
    finalPrice = price - (price * discount) / 100;
  } 
  // Flat discount
  else {
    finalPrice = price - discount;
  }

  // Prevent negative prices
  if (finalPrice < 0) finalPrice = 0;

  return safeRound(finalPrice);
}


/* =====================================================
   CALCULATE SAVINGS
===================================================== */
export function calculateSavings(price, offer) {
  if (!offer) return 0;

  const discounted = applyDiscount(price, offer);
  return safeRound(price - discounted);
}


/* =====================================================
   FORMAT PRICE
===================================================== */
export function formatPrice(amount, currency = "₹") {
  return `${currency}${safeRound(amount).toLocaleString("en-IN")}`;
}


/* =====================================================
   SAFE ROUND (2 decimals)
===================================================== */
function safeRound(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}