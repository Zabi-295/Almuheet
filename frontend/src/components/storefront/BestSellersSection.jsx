import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function BestSellersSection({ products = [] }) {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('executive-range');

  const tabs = [
    { id: 'executive-range', label: 'EXECUTIVE RANGE' },
    { id: 'royal-oud', label: 'ROYAL OUD' },
    { id: 'poetic-range', label: 'POETIC RANGE' },
    { id: 'sensory-range', label: 'SENSORY RANGE' },
    { id: 'tester-box', label: 'DISCOVERY SETS' }
  ];

  // Mock review counts and ratings matching Scents N Stories
  const reviewsData = {
    1: { rating: 5.0, count: 645 },
    2: { rating: 4.9, count: 410 },
    3: { rating: 4.9, count: 262 },
    4: { rating: 4.8, count: 48 },
    5: { rating: 5.0, count: 520 },
    6: { rating: 4.9, count: 380 },
    7: { rating: 4.9, count: 185 },
    8: { rating: 4.9, count: 295 },
    9: { rating: 5.0, count: 890 }
  };

  // Filter products by active tab category
  const filteredProducts = products.filter(p => {
    if (activeTab === 'executive-range') return p.category_id === 1 || p.slug?.includes('autumn') || p.slug?.includes('catch') || p.slug?.includes('smash') || p.slug?.includes('merry');
    if (activeTab === 'royal-oud') return p.category_id === 2 || p.slug?.includes('oud') || p.slug?.includes('eagle');
    if (activeTab === 'poetic-range') return p.category_id === 3 || p.slug?.includes('eagle') || p.slug?.includes('sapphire');
    if (activeTab === 'sensory-range') return p.category_id === 4 || p.slug?.includes('rose') || p.slug?.includes('musk');
    if (activeTab === 'tester-box') return p.category_id === 5 || p.slug?.includes('tester') || p.slug?.includes('discovery');
    return true;
  });

  const displayList = filteredProducts.slice(0, 4);

  const formatPKR = (amount) => {
    return `Rs.${Number(amount || 0).toLocaleString()}`;
  };

  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '3.5rem 0 4.5rem', borderBottom: '1px solid #E5E7EB' }}>
      <div className="container">
        
        {/* Section Heading & Subtitle (Scents N Stories Style) */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#111827',
              margin: '0 0 0.4rem'
            }}
          >
            OUR BEST SELLERS
          </h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: 0 }}>
            Perfumes you won't find anywhere else
          </p>
        </div>

        {/* Category Horizontal Underline Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2.5rem',
            borderBottom: '1px solid #E5E7EB',
            marginBottom: '3rem',
            flexWrap: 'wrap'
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #111827' : '2px solid transparent',
                  padding: '0.75rem 0.5rem',
                  color: isActive ? '#111827' : '#6B7280',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 600,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '-1px'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Row (Mobile: 2 per row, PC: 5 per row) */}
        <div className="ecommerce-product-grid-5" style={{ alignItems: 'stretch' }}>
          {displayList.map((product) => {
            const reviews = reviewsData[product.id] || { rating: 4.9, count: 120 };
            return (
              <div
                key={product.id}
                className="product-card"
              >
                {/* Bottle Image Container on pure white */}
                <Link
                  to={`/product/${product.slug || product.id}`}
                  className="card-img-container"
                  style={{
                    display: 'block',
                    position: 'relative',
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    marginBottom: '0.65rem'
                  }}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />

                  {/* SALE badge if compare_at_price exists */}
                  {product.compare_at_price > product.price && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '6px',
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '3px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      SALE
                    </span>
                  )}
                </Link>

                {/* Product Title (clamped to 2 lines for uniform height) */}
                <Link
                  to={`/product/${product.slug || product.id}`}
                  className="product-card-title"
                  style={{ textDecoration: 'none' }}
                >
                  {product.name}
                </Link>

                {/* Subtitle / Range */}
                <p className="product-card-subtitle">
                  {product.short_description ? product.short_description.split('.')[0] : 'Executive Range | 100ml Perfume'}
                </p>

                {/* Star Ratings & Review Count (Scents N Stories Style) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '1px', color: '#F59E0B' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="#F59E0B" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 500 }}>
                    {reviews.count} Reviews
                  </span>
                </div>

                {/* Price (Red Bold / Dark Accent) & Add To Cart Button */}
                <div className="product-card-footer">
                  <div>
                    <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#DC2626' }}>
                      {formatPKR(product.price)}
                    </span>
                    {product.compare_at_price > product.price && (
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textDecoration: 'line-through', marginLeft: '0.35rem' }}>
                        {formatPKR(product.compare_at_price)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    style={{
                      backgroundColor: '#111827',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C5A059')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
                  >
                    <ShoppingBag size={12} />
                    Add
                  </button>
                </div>
              </div>
            );
          })}

          {/* 5th Card: The Scents N Stories "Discover More -> [Explore]" Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              minHeight: '380px',
              position: 'relative',
              overflow: 'hidden',
              backgroundImage: 'linear-gradient(145deg, #F3F4F6 0%, #E5E7EB 100%)'
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                width: '100%',
                maxWidth: '240px'
              }}
            >
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '1rem'
                }}
              >
                Discover 27 More ↗
              </h3>

              <Link
                to={`/shop?category=${activeTab}`}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#FFFFFF',
                  color: '#111827',
                  textDecoration: 'none',
                  border: '1px solid #D1D5DB',
                  padding: '0.6rem 1.75rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#111827';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#111827';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#111827';
                  e.currentTarget.style.borderColor = '#D1D5DB';
                }}
              >
                Explore
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
