// src/views/Home.jsx

import React, { useEffect } from "react";
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

  const { products = [], loading } = useSelector(
    (s) => s.products || {}
  );
  const { shops = [] } = useSelector(
    (s) => s.shops || {}
  );

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchShops());
    dispatch(fetchAllOffers());
  }, [dispatch]);

  // 👉 Add-to-cart handler
  const addItemToCart = (product, e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

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
        <SectionTitle>Recommended For You</SectionTitle>
        <Recommended
          products={products}
          addToCart={addItemToCart}
        />
      </Section>

      {/* ===== FLOOR SECTION ===== */}
      <Section>
        <FloorSection addToCart={addItemToCart} />
      </Section>

      {/* ===== POPULAR SHOPS ===== */}
      <Section>
        <SectionTitle>Popular Shops</SectionTitle>

        {loading ? (
          <Grid>
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </Grid>
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