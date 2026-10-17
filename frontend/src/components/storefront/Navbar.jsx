import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

export default function Navbar() {
  const { itemCount, setIsCartOpen } = useCart();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'EXECUTIVE RANGE', path: '/shop?category=executive-range' },
    { label: 'GIFT BOX', path: '/shop?category=gift-box' },
    { label: 'UNDER 2500', path: '/shop?max_price=2500' },
    { label: 'OUD', path: '/shop?category=royal-oud' },
    { label: 'TESTER BOX', path: '/shop?category=tester-box' },
    { label: 'ATTAR', path: '/shop?category=poetic-range' },
    { label: 'AIR DIFFUSERS', path: '/shop?category=sensory-range' },
    { label: 'LOYALTY', path: '/about' },
    { label: 'CONTACT', path: '/contact' }
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 60, width: '100%', backgroundColor: '#0A0A0C' }}>
      
      {/* 1. Top Announcement Bar (Scents N Stories Style) */}
      <div
        style={{
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0.45rem 1rem',
          textAlign: 'center',
          color: '#FFFFFF',
          fontSize: '0.78rem',
          fontWeight: 600,
          letterSpacing: '0.04em'
        }}
      >
        <span>Free Shipping on orders over Rs. 3000 &bull; 15 Days Hassle-free returns &bull; Cash on Delivery</span>
      </div>

      {/* 2. Main Header (Pill Search - Center Brand Logo - Cart & Profile) */}
      <div className="container" style={{ padding: '0.85rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'none',
              padding: '0.4rem'
            }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Left Column: Pill Search Input (Scents N Stories Style) */}
          <div className="desktop-search" style={{ flex: '0 1 320px', minWidth: '220px' }}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#18181B',
                  border: '1px solid #3F3F46',
                  borderRadius: '9999px',
                  color: '#FFFFFF',
                  padding: '0.55rem 2.6rem 0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  transition: 'border-color 0.2s ease, background-color 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#C5A059';
                  e.target.style.backgroundColor = '#222226';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3F3F46';
                  e.target.style.backgroundColor = '#18181B';
                }}
              />
              <button
                type="submit"
                aria-label="Submit search"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* Center Column: Scents N Stories Style Cursive / Emblem Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            {/* Elegant Golden Quill / Flame Emblem */}
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5 C55 30, 80 40, 80 65 C80 82, 66 95, 50 95 C34 95, 20 82, 20 65 C20 40, 45 30, 50 5 Z" fill="url(#goldGradient)" />
              <path d="M50 25 C47 45, 36 55, 36 68 C36 78, 42 84, 50 86 C48 76, 52 65, 58 55 C64 45, 54 35, 50 25 Z" fill="#0A0A0C" opacity="0.4" />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ECCF88" />
                  <stop offset="50%" stopColor="#C5A059" />
                  <stop offset="100%" stopColor="#9F791C" />
                </linearGradient>
              </defs>
            </svg>

            {/* Brand Typography */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, cursive, serif",
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  fontStyle: 'italic',
                  color: '#FFFFFF'
                }}
              >
                Al Muheet
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#C5A059',
                  marginTop: '-2px',
                  fontWeight: 600
                }}
              >
                FRAGRANCE
              </span>
            </div>
          </Link>

          {/* Right Column: Track Order & Shopping Cart (Scents N Stories Style) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            
            {/* Account / Track Order Icon */}
            <Link
              to="/track-order"
              title="Track Order / Account"
              style={{
                color: '#FFFFFF',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '0.4rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ECCF88')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            >
              <User size={20} />
            </Link>

            {/* Cart Trigger Button: Bag icon + CART text + Count badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                cursor: 'pointer',
                padding: '0.4rem 0.6rem',
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              aria-label="View Shopping Cart"
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-8px',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                CART
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Secondary Sub-Navbar (All Collections Links) */}
      <div
        className="sub-navbar"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#0A0A0C',
          padding: '0.55rem 0'
        }}
      >
        <div className="container">
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.75rem',
              flexWrap: 'wrap'
            }}
          >
            {/* SHOP Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <Link
                to="/shop"
                style={{
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.3rem 0',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ECCF88')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              >
                SHOP
                <ChevronDown size={14} />
              </Link>

              {shopDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#111114',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    minWidth: '200px',
                    zIndex: 100,
                    padding: '0.5rem 0'
                  }}
                >
                  <Link
                    to="/shop"
                    style={{
                      display: 'block',
                      padding: '0.5rem 1.25rem',
                      color: '#E5E7EB',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1C1C20'; e.currentTarget.style.color = '#ECCF88'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E5E7EB'; }}
                  >
                    All Perfumes
                  </Link>
                  <Link
                    to="/shop?category=executive-range"
                    style={{
                      display: 'block',
                      padding: '0.5rem 1.25rem',
                      color: '#E5E7EB',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1C1C20'; e.currentTarget.style.color = '#ECCF88'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E5E7EB'; }}
                  >
                    Executive Range
                  </Link>
                  <Link
                    to="/shop?category=royal-oud"
                    style={{
                      display: 'block',
                      padding: '0.5rem 1.25rem',
                      color: '#E5E7EB',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1C1C20'; e.currentTarget.style.color = '#ECCF88'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E5E7EB'; }}
                  >
                    Royal Oud & Oriental
                  </Link>
                  <Link
                    to="/shop?category=poetic-range"
                    style={{
                      display: 'block',
                      padding: '0.5rem 1.25rem',
                      color: '#E5E7EB',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1C1C20'; e.currentTarget.style.color = '#ECCF88'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E5E7EB'; }}
                  >
                    Poetic Range
                  </Link>
                  <Link
                    to="/shop?category=sensory-range"
                    style={{
                      display: 'block',
                      padding: '0.5rem 1.25rem',
                      color: '#E5E7EB',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1C1C20'; e.currentTarget.style.color = '#ECCF88'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E5E7EB'; }}
                  >
                    Sensory Range
                  </Link>
                </div>
              )}
            </div>

            {/* Individual Category Direct Links */}
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                style={{
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '0.3rem 0',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ECCF88')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* 4. Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#0F0F12',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%', marginBottom: '0.5rem' }}>
            <input
              type="text"
              placeholder="Search perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#18181B',
                border: '1px solid #3F3F46',
                borderRadius: '9999px',
                color: '#FFFFFF',
                padding: '0.6rem 2.6rem 0.6rem 1.25rem',
                fontSize: '0.85rem'
              }}
            />
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#A1A1AA'
              }}
            >
              <Search size={16} />
            </button>
          </form>

          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#ECCF88', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700 }}
          >
            SHOP ALL PERFUMES
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: '#E5E7EB',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.3rem 0'
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/track-order"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: '#9CA3AF',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 500,
              paddingTop: '0.5rem',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            Track Order & Delivery Status
          </Link>
        </div>
      )}
    </header>
  );
}
