import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function AttarSection() {
  const { addToCart } = useCart();

  const attars = [
    {
      id: 101,
      name: 'Iqbal - Signature Attar (8ML)',
      subtitle: 'Sophisticated Scent Journey',
      price: 1950,
      compare_at_price: 2600,
      image_url: '/images/signature-attar.jpg',
      category: 'attar',
      rating: 5.0,
      reviews: 312
    },
    {
      id: 102,
      name: 'Faiz - Signature Attar (8ML)',
      subtitle: 'Poetry in Every Drop',
      price: 2290,
      compare_at_price: 2900,
      image_url: '/images/signature-attar.jpg',
      category: 'attar',
      rating: 5.0,
      reviews: 428
    },
    {
      id: 103,
      name: 'Hisar - Signature Attar (8ML)',
      subtitle: 'Royal Oud with Depth',
      price: 1890,
      compare_at_price: 2500,
      image_url: '/images/signature-attar.jpg',
      category: 'attar',
      rating: 4.9,
      reviews: 195
    },
    {
      id: 104,
      name: 'Oud Zauq - Signature Attar (8ML)',
      subtitle: 'Sophisticated Oriental Scent',
      price: 1450,
      compare_at_price: 1950,
      image_url: '/images/signature-attar.jpg',
      category: 'attar',
      rating: 4.8,
      reviews: 164
    },
    {
      id: 105,
      name: 'Oud Garden - Signature Attar (8ML)',
      subtitle: 'A Fragrance of Prestige',
      price: 1450,
      compare_at_price: 1950,
      image_url: '/images/signature-attar.jpg',
      category: 'attar',
      rating: 4.9,
      reviews: 210
    }
  ];

  const formatPKR = (amount) => {
    return `Rs.${Number(amount || 0).toLocaleString()}`;
  };

  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '3.5rem 0 4rem', borderTop: '1px solid #E5E7EB' }}>
      <div className="container">
        
        {/* Section Header (Scents N Stories Style) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            borderBottom: '1px solid #E5E7EB',
            paddingBottom: '0.75rem'
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#111827',
                margin: '0 0 0.2rem',
                letterSpacing: '0.04em'
              }}
            >
              SIGNATURE ATTAR (8ML)
            </h3>
            <p style={{ color: '#6B7280', fontSize: '0.82rem', margin: 0 }}>
              100% pure concentrated non-alcoholic artisanal perfume oils
            </p>
          </div>

          <Link
            to="/shop?category=poetic-range"
            style={{
              color: '#111827',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#B3861B')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#111827')}
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 5 Attar Products Grid (Mobile: 2 per row, PC: 5 per row) */}
        <div className="ecommerce-product-grid-5">
          {attars.map((item) => (
            <div
              key={item.id}
              className="product-card"
            >
              {/* Image Container with SALE Badge */}
              <div
                className="card-img-container"
                style={{
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.65rem'
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />

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
                    letterSpacing: '0.04em'
                  }}
                >
                  SALE
                </span>
              </div>

              {/* Title (clamped to 2 lines for uniform height) */}
              <h4
                className="product-card-title"
                style={{ margin: 0 }}
              >
                {item.name}
              </h4>

              {/* Subtitle */}
              <p className="product-card-subtitle">
                {item.subtitle}
              </p>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '1px', color: '#F59E0B' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="#F59E0B" />
                  ))}
                </div>
                <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>
                  {item.reviews} Reviews
                </span>
              </div>

              {/* Price & Add Button */}
              <div className="product-card-footer">
                <div>
                  <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#DC2626' }}>
                    {formatPKR(item.price)}
                  </span>
                  {item.compare_at_price > item.price && (
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textDecoration: 'line-through', marginLeft: '0.35rem' }}>
                      {formatPKR(item.compare_at_price)}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image_url: item.image_url,
                    short_description: item.subtitle,
                    stock_quantity: 50
                  }, 1)}
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
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
