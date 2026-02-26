// src/components/Layout/Navbar.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
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

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const Suggestions = styled.ul`
  position: absolute;
  top: 45px;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 200;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SuggestionItem = styled.button`
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: ${({ $active }) =>
    $active ? "#f5f5f5" : "white"};
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
  text-align: left;

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

  &:hover {
    background: #e5e7eb;
  }
`;

const AdminLink = styled(Link)`
  font-weight: 700;
  color: #c62828;
  text-decoration: none;
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
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef();

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
      } catch {}
    }, 300);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  /* CLOSE ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClick = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      navigate(suggestions[activeIndex].link);
      setSuggestions([]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  const onLogout = () => dispatch(logoutUser());

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
        {user && (user.role === "merchant" || user.role === "admin") && (
          <NavLinkItem to="/dashboard">Dashboard</NavLinkItem>
        )}
      </Left>

      {/* SEARCH */}
      <SearchWrap ref={containerRef}>
        <form onSubmit={onSearchSubmit}>
          <SearchInput
            type="text"
            role="combobox"
            aria-expanded={suggestions.length > 0}
            aria-controls="search-suggestions"
            placeholder="Search products, shops, offers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </form>

        {suggestions.length > 0 && (
          <Suggestions id="search-suggestions" role="listbox">
            {suggestions.map((item, index) => (
              <li key={item.id}>
                <SuggestionItem
                  $active={index === activeIndex}
                  role="option"
                  aria-selected={index === activeIndex}
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
              </li>
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
              <AdminLink to="/admin">Admin</AdminLink>
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