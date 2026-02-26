// src/views/Home.jsx

import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchProducts } from "../features/products/productSlice";
import { fetchShops } from "../features/shops/shopSlice";
import { fetchAllOffers } from "../features/offers/offerSlice";

import Hero from "../components/Home/Hero";
import Categories from "../components/Home/Categories";
import FeaturedCategories from "../components/Home/FeaturedCategories";
import OfferBanners from "../components/Home/OfferBanners";
import TrendingOffers from "../components/Home/TrendingOffers";
import Recommended from "../components/Home/Recommended";
import FloorSection from "../components/Home/FloorSection";
import SkeletonCard from "../components/UI/SkeletonCard";

import { addToCart } from "../features/cart/cartSlice";

/* ===================== STYLES ===================== */

const Page = styled.div`
  padding: 30px;
  max-width: 1250px;
  margin: auto;
`;

const Section = styled.section`
  margin: 50px 0;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
`;

const ShopCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius};
  box-shadow: ${({ theme }) => theme.shadow};
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-6px);
  }
`;

const ShopName = styled.h3`
  margin-bottom: 6px;
`;

const ShopCategory = styled.p`
  opacity: 0.7;
`;

/* ===================== COMPONENT ===================== */

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productsState = useSelector((s) => s.products || {});
  const shopsState = useSelector((s) => s.shops || {});

  const products = productsState.products || [];
  const productsStatus = productsState.status || "idle";

  const shops = shopsState.shops || [];
  const shopsStatus = shopsState.status || "idle";

  /* ===== FETCH DATA ONLY IF NEEDED ===== */
  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchProducts());
    }

    if (shopsStatus === "idle") {
      dispatch(fetchShops());
    }

    dispatch(fetchAllOffers());
  }, [dispatch, productsStatus, shopsStatus]);

  /* ===== ADD TO CART ===== */
  const addItemToCart = (product, e) => {
    e?.stopPropagation?.();
    dispatch(addToCart(product));
  };

  /* ===== MEMOIZED RECOMMENDED ===== */
  const recommendedProducts = useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  return (
    <Page>
      {/* ===== HERO SECTION ===== */}
      <Hero />

      {/* ===== CATEGORIES ===== */}
      <Section>
        <Categories />
      </Section>

      <Section>
        <FeaturedCategories />
      </Section>

      {/* ===== OFFERS ===== */}
      <Section>
        <OfferBanners />
      </Section>

      <Section>
        <TrendingOffers />
      </Section>

      {/* ===== RECOMMENDED ===== */}
      <Section>
        {productsStatus === "loading" ? (
          <Grid>
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </Grid>
        ) : recommendedProducts.length === 0 ? (
          <p style={{ opacity: 0.6 }}>
            No products available right now.
          </p>
        ) : (
          <Recommended
            products={recommendedProducts}
            addToCart={addItemToCart}
          />
        )}
      </Section>

      {/* ===== FLOOR SECTION ===== */}
      <Section>
        <FloorSection />
      </Section>

      {/* ===== POPULAR SHOPS ===== */}
      <Section>
        <SectionTitle>Popular Shops</SectionTitle>

        {shopsStatus === "loading" ? (
          <Grid>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </Grid>
        ) : shops.length === 0 ? (
          <p style={{ opacity: 0.6 }}>
            No shops available yet.
          </p>
        ) : (
          <Grid>
            {shops.slice(0, 6).map((shop) => (
              <ShopCard
                key={shop.id}
                onClick={() =>
                  navigate(`/shops/${shop.id}`)
                }
              >
                <ShopName>{shop.name}</ShopName>
                <ShopCategory>
                  {shop.category}
                </ShopCategory>
              </ShopCard>
            ))}
          </Grid>
        )}
      </Section>
    </Page>
  );
}