// src/components/Layout/Navbar.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { globalSearch } from "../../features/search/searchSlice";

/* ==============================
   STYLES
================================ */

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 14px 30px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Brand = styled(Link)`
  font-weight: 800;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`;

const NavLinkItem = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  position: relative;
  transition: 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Badge = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
`;

const SearchWrap = styled.div`
  position: relative;
  width: 340px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  outline: none;
  transition: 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const Suggestions = styled.div`
  position: absolute;
  top: 45px;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 200;
`;

const SuggestionItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
  transition: 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const LogoutBtn = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  background: #f3f4f6;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

/* ==============================
   COMPONENT
================================ */

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);

  const compareCount = useSelector((s) => s.comparison.items.length);
  const wishlistCount = useSelector((s) => s.wishlist.items.length);
  const cartCount = useSelector((s) => s.cart?.items?.length || 0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  /* SEARCH SUGGESTIONS */
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await dispatch(globalSearch(query)).unwrap();
        setSuggestions(res.slice(0, 6));
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setSuggestions([]);
  };

  const onLogout = async () => dispatch(logoutUser());

  return (
    <Nav>
      <Left>
        <Brand to="/">SuperMall</Brand>

        <NavLinkItem to="/compare">
          Compare <Badge>{compareCount}</Badge>
        </NavLinkItem>

        <NavLinkItem to="/wishlist">
          Wishlist <Badge>{wishlistCount}</Badge>
        </NavLinkItem>

        <NavLinkItem to="/cart">
          Cart <Badge>{cartCount}</Badge>
        </NavLinkItem>

        {user && <NavLinkItem to="/orders">My Orders</NavLinkItem>}
        {user && <NavLinkItem to="/dashboard">Dashboard</NavLinkItem>}
      </Left>

      {/* SEARCH */}
      <SearchWrap>
        <form onSubmit={onSearchSubmit}>
          <SearchInput
            type="text"
            placeholder="Search products, shops, offers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {suggestions.length > 0 && (
          <Suggestions>
            {suggestions.map((item) => (
              <SuggestionItem
                key={item.id}
                onClick={() => {
                  navigate(item.link);
                  setSuggestions([]);
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt=""
                    width="40"
                    height="40"
                    style={{ borderRadius: 8, objectFit: "cover" }}
                  />
                )}
                <div>
                  <strong>{item.title}</strong>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>
                    {item.type}
                  </div>
                </div>
              </SuggestionItem>
            ))}
          </Suggestions>
        )}
      </SearchWrap>

      <Right>
        {user ? (
          <>
            <span style={{ fontSize: 14, opacity: 0.8 }}>
              {user.profile?.name || user.email} ({user.role})
            </span>

            <LogoutBtn onClick={onLogout}>Logout</LogoutBtn>

            {user.role === "admin" && (
              <NavLinkItem to="/admin" style={{ fontWeight: 700, color: "#c62828" }}>
                Admin
              </NavLinkItem>
            )}
          </>
        ) : (
          <>
            <NavLinkItem to="/login">Login</NavLinkItem>
            <NavLinkItem to="/register">Register</NavLinkItem>
          </>
        )}
      </Right>
    </Nav>
  );
}