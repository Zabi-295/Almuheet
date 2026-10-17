import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategorySlider() {
  const scrollRef = useRef(null);

  const categories = [
    {
      title: 'Sample Set',
      image: '/images/discovery-set.jpg',
      link: '/shop?category=tester-box',
      badge: 'Discovery'
    },
    {
      title: 'Perfumes Premium',
      image: '/images/hero.jpg',
      link: '/shop?category=executive-range',
      badge: 'Prestige'
    },
    {
      title: 'Attar',
      image: '/images/signature-attar.jpg',
      link: '/shop?category=poetic-range',
      badge: 'Artisanal'
    },
    {
      title: 'Perfume For Men',
      image: '/images/sapphire-smoke.jpg',
      link: '/shop?gender=Men',
      badge: 'Bestseller'
    },
    {
      title: 'Perfume For Women',
      image: '/images/blush-peony.jpg',
      link: '/shop?gender=Women',
      badge: 'Popular'
    },
    {
      title: 'New Arrival',
      image: '/images/green-velvet.jpg',
      link: '/shop?category=executive-range',
      badge: 'New'
    },
    {
      title: 'Gift Box',
      image: '/images/rose-taif.jpg',
      link: '/shop?category=gift-box',
      badge: 'Gift'
    },
    {
      title: 'Ahl E Oud',
      image: '/images/arabian-eagle.jpg',
      link: '/shop?category=royal-oud',
      badge: 'Pure Oud'
    },
    {
      title: 'Body Mist',
      image: '/images/body-mist.jpg',
      link: '/shop?category=sensory-range',
      badge: 'Body'
    },
    {
      title: 'Air Care',
      image: '/images/air-care.jpg',
      link: '/shop?category=sensory-range',
      badge: 'Home'
    },
    {
      title: 'Perfume Wax',
      image: '/images/perfume-wax.jpg',
      link: '/shop?category=executive-range',
      badge: 'Solid'
    }
  ];

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', padding: '1.25rem 0 1.5rem', backgroundColor: '#FFFFFF' }}>
      <div className="container" style={{ position: 'relative' }}>
        
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          aria-label="Scroll left"
          style={{
            position: 'absolute',
            left: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#111827',
            transition: 'background-color 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE
            padding: '0.5rem 1.5rem'
          }}
        >
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              style={{
                flex: '0 0 120px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.25s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {/* Rounded Image Container (Scents N Stories Style) */}
              <div
                style={{
                  position: 'relative',
                  width: '115px',
                  height: '145px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#FAFAFA',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.06)',
                  border: '1px solid #E5E7EB'
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Dark Gradient Overlay for bottom text legibility */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)'
                  }}
                />

                {/* Bottom Label Text */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '6px',
                    right: '6px',
                    textAlign: 'center'
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      letterSpacing: '0.01em',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                    }}
                  >
                    {cat.title}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          aria-label="Scroll right"
          style={{
            position: 'absolute',
            right: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#111827',
            transition: 'background-color 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
