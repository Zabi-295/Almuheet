import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function OudShowcaseSection({ products = [] }) {
  const { addToCart } = useCart();

  // Filter products for Oud
  const oudProducts = products.filter(p => 
    p.category_id === 2 || p.slug?.includes('oud') || p.slug?.includes('eagle') || p.name?.toLowerCase().includes('oud')
  );

  // If we have fewer than 5, supplement with other high-end extraits
  const displayOuds = oudProducts.length >= 4 
    ? oudProducts.slice(0, 5) 
    : products.slice(0, 5);

  const formatPKR = (amount) => {
    return `Rs.${Number(amount || 0).toLocaleString()}`;
  };

  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '0 0 5rem' }}>
      
      {/* 1. Full-Width Arabian Oud Banner (Screenshot 5) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '420px',
          backgroundImage: 'url(/images/oud-moments.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '3.5rem'
        }}
      >
        {/* Subtle white/light gradient overlay to pop text on the left */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0) 75%)'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '480px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#111827',
                lineHeight: 1.15,
                margin: '0 0 0.5rem'
              }}
            >
              Oud made for moments
            </h2>
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, cursive, serif",
                fontSize: '2.2rem',
                fontStyle: 'italic',
                fontWeight: 600,
                color: '#94680E',
                margin: '0 0 1.5rem',
                lineHeight: 1
              }}
            >
              That matters —
            </p>

            <Link
              to="/shop?category=royal-oud"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#111827',
                color: '#FFFFFF',
                textDecoration: 'none',
                padding: '0.75rem 1.75rem',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.04em',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#94680E')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
            >
              Explore Royal Oud
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. OUD Section Title & Product Row (Screenshot 5) */}
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            borderBottom: '1px solid #E5E7EB',
            paddingBottom: '0.75rem'
          }}
        >
          <h3
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#111827',
              margin: 0,
              letterSpacing: '0.05em'
            }}
          >
            OUD
          </h3>

          <Link
            to="/shop?category=royal-oud"
            style={{
              color: '#111827',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94680E')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#111827')}
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 5-Column Oud Grid (Mobile: 2 per row, PC: 5 per row) */}
        <div className="ecommerce-product-grid-5">
          {displayOuds.map((product) => (
            <div
              key={product.id}
              className="product-card"
            >
              {/* Image with Red SALE Badge at bottom-left */}
              <Link
                to={`/product/${product.slug || product.id}`}
                className="card-img-container"
                style={{
                  position: 'relative',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  display: 'block',
                  marginBottom: '0.65rem'
                }}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />

                {/* Red SALE Badge (Scents N Stories Style) */}
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
              </Link>

              {/* Title (clamped to 2 lines for uniform height) */}
              <Link
                to={`/product/${product.slug || product.id}`}
                className="product-card-title"
                style={{ textDecoration: 'none' }}
              >
                {product.name}
              </Link>

              {/* Subtitle */}
              <p className="product-card-subtitle">
                {product.short_description ? product.short_description.split('.')[0] : 'Royal Oud | 100ml Extrait'}
              </p>

              {/* Price & Add to Cart */}
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
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#94680E')}
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
