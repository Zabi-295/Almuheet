import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TopCollectionsShowcase() {
  const scrollRef = useRef(null);

  const collections = [
    {
      title: 'Sensory Range',
      subtitle: 'Velvety Florals & Musks',
      image: '/images/rose-taif.jpg',
      link: '/shop?category=sensory-range'
    },
    {
      title: 'Executive Range',
      subtitle: 'Boardroom Signatures',
      image: '/images/hero.jpg',
      link: '/shop?category=executive-range'
    },
    {
      title: 'Poetic Range',
      subtitle: 'Artisanal Extrait de Parfum',
      image: '/images/arabian-eagle.jpg',
      link: '/shop?category=poetic-range'
    },
    {
      title: 'New Arrivals',
      subtitle: 'Latest French & Oriental Drops',
      image: '/images/green-velvet.jpg',
      link: '/shop?category=executive-range'
    },
    {
      title: 'Gifting & Sets',
      subtitle: 'Luxury Bespoke Flacons',
      image: '/images/discovery-set.jpg',
      link: '/shop?category=gift-box'
    }
  ];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section style={{ backgroundColor: '#FFFFFF', padding: '3rem 0 3.5rem' }}>
      <div className="container" style={{ position: 'relative' }}>
        
        {/* Section Heading (Scents N Stories Style) */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2
            style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#111827',
              margin: 0
            }}
          >
            TOP PERFUME COLLECTIONS
          </h2>
        </div>

        {/* Navigation Left Arrow */}
        <button
          onClick={() => handleScroll('left')}
          aria-label="Previous collections"
          style={{
            position: 'absolute',
            left: '4px',
            top: '55%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#111827',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Collections Cards Container */}
        <div
          ref={scrollRef}
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'minmax(230px, 1fr)',
            gap: '1.25rem',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            padding: '0.5rem 1rem'
          }}
        >
          {collections.map((col, idx) => (
            <Link
              key={idx}
              to={col.link}
              style={{
                textDecoration: 'none',
                position: 'relative',
                height: '320px',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                backgroundColor: '#FAFAFA',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
              }}
            >
              {/* Image */}
              <img
                src={col.image}
                alt={col.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Bottom Gradient Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 50%, transparent 80%)'
                }}
              />

              {/* Bottom Pill Card Label */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.75rem',
                  textAlign: 'center'
                }}
              >
                <h3
                  style={{
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    margin: 0,
                    letterSpacing: '0.02em'
                  }}
                >
                  {col.title}
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '0.7rem',
                    margin: '2px 0 0',
                    fontWeight: 500
                  }}
                >
                  {col.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Right Arrow */}
        <button
          onClick={() => handleScroll('right')}
          aria-label="Next collections"
          style={{
            position: 'absolute',
            right: '4px',
            top: '55%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#111827',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
}
