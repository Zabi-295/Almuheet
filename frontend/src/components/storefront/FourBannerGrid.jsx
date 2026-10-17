import React from 'react';
import { Link } from 'react-router-dom';

export default function FourBannerGrid() {
  const banners = [
    {
      title: 'Perfume Wax',
      subtitle: 'Solid concentrated fragrance for wrists & pulse points',
      image: '/images/perfume-wax.jpg',
      link: '/shop?category=executive-range'
    },
    {
      title: 'Sample Set',
      subtitle: 'Discovery vials to test our top signature fragrances',
      image: '/images/discovery-set.jpg',
      link: '/shop?category=tester-box'
    },
    {
      title: 'Body Mist',
      subtitle: 'All-day refreshing hydration with fine fragrance oils',
      image: '/images/body-mist.jpg',
      link: '/shop?category=sensory-range'
    },
    {
      title: 'Air Care',
      subtitle: 'Artisanal reed diffusers, candles & car diffusers',
      image: '/images/air-care.jpg',
      link: '/shop?category=sensory-range'
    }
  ];

  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '1rem 0 4.5rem' }}>
      <div className="container">
        
        {/* 2x2 Banner Cards Grid (Screenshot 2) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1.25rem'
          }}
        >
          {banners.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              style={{
                textDecoration: 'none',
                position: 'relative',
                height: 'clamp(170px, 26vw, 240px)',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: '#F9FAFB',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.06)';
              }}
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Gradient to make typography pop */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.88) 55%, #FFFFFF 100%)'
                }}
              />

              {/* Right Side Content (Scents N Stories Style) */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  marginLeft: 'auto',
                  padding: '1.25rem 1.5rem',
                  maxWidth: '58%',
                  textAlign: 'right'
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(1.35rem, 3.2vw, 1.85rem)',
                    fontWeight: 700,
                    color: '#111827',
                    margin: '0 0 0.3rem',
                    lineHeight: 1.15
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: '#6B7280',
                    margin: 0,
                    lineHeight: 1.4
                  }}
                >
                  {item.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
