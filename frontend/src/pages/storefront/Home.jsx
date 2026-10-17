import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import api from '../../api';
import CategorySlider from '../../components/storefront/CategorySlider';
import TopCollectionsShowcase from '../../components/storefront/TopCollectionsShowcase';
import BestSellersSection from '../../components/storefront/BestSellersSection';
import AttarSection from '../../components/storefront/AttarSection';
import FourBannerGrid from '../../components/storefront/FourBannerGrid';
import OudShowcaseSection from '../../components/storefront/OudShowcaseSection';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/products');
        setProducts(prodRes?.data || []);
      } catch (err) {
        console.error('Failed to load products for home:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      
      {/* 1. Big Hero Banner: When Seasons Become Stories (Comes FIRST right below Navbar) */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '520px',
          backgroundImage: "url('/images/autumn-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Dark Vignette / Gradient Overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(10,10,12,0.92) 0%, rgba(10,10,12,0.65) 45%, rgba(10,10,12,0.15) 100%)'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10, padding: '4.5rem 1.5rem' }}>
          <div style={{ maxWidth: '640px' }}>
            
            <span
              style={{
                display: 'inline-block',
                color: '#ECCF88',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: '1rem',
                fontFamily: 'var(--font-sans)'
              }}
            >
              AL MUHEET AUTUMN DROP
            </span>

            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.1,
                marginBottom: '1rem',
                letterSpacing: '-0.02em'
              }}
            >
              When Seasons <br />
              <span
                style={{
                  fontFamily: "'Playfair Display', Georgia, cursive, serif",
                  fontStyle: 'italic',
                  fontWeight: 600,
                  color: '#ECCF88'
                }}
              >
                Become Stories
              </span>
            </h1>

            <p
              style={{
                color: '#D1D5DB',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '480px'
              }}
            >
              Immerse yourself in roasted tonka bean, ambergris, and golden autumn woods. Handcrafted Extrait de Parfum with unmatched longevity.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/shop?category=executive-range"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  color: '#111827',
                  textDecoration: 'none',
                  padding: '0.85rem 2rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transition: 'background-color 0.2s, transform 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ECCF88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Shop Executive Range
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/shop?category=royal-oud"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'transparent',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  padding: '0.85rem 2rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: '1px solid rgba(255,255,255,0.4)',
                  backdropFilter: 'blur(4px)',
                  transition: 'background-color 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#FFFFFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
              >
                Explore Royal Oud
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Collection Swiper / Slider placed DIRECTLY BELOW the big hero banner (As requested by user!) */}
      {/* Includes: Sample Set, Perfumes Premium, Attar, Men, Women, etc. */}
      <section style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
        <CategorySlider />
      </section>

      {/* 3. TOP PERFUME COLLECTIONS Showcase Cards (Screenshot 3) */}
      <TopCollectionsShowcase />

      {/* 4. OUR BEST SELLERS with Interactive Category Tabs (Screenshot 3 & 4) */}
      <BestSellersSection products={products} />

      {/* 5. Signature Attar 8ML Section (Screenshot 2 Top Row) */}
      <AttarSection />

      {/* 6. 4-Banner Grid (Perfume Wax, Sample Set, Body Mist, Air Care - Screenshot 2) */}
      <FourBannerGrid />

      {/* 7. OUD Section with Middle Eastern Banner (Screenshot 5) */}
      <OudShowcaseSection products={products} />

      {/* 8. Customer Trust & Service Guarantee Bar */}
      <section style={{ backgroundColor: '#F9FAFB', borderTop: '1px solid #E5E7EB', padding: '3.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#B3861B', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Truck size={22} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: '0 0 0.35rem' }}>
                Free Nationwide Shipping
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: 0 }}>
                Complimentary delivery across Pakistan on all orders over Rs. 3,000.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#B3861B', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <RefreshCw size={22} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: '0 0 0.35rem' }}>
                15 Days Hassle-Free Returns
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: 0 }}>
                Complete peace of mind. Easy exchange and returns within 15 days.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#B3861B', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <ShieldCheck size={22} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: '0 0 0.35rem' }}>
                Cash On Delivery (COD)
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: 0 }}>
                Pay with cash at your doorstep upon receiving your luxury perfume flacon.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#B3861B', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <Award size={22} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: '0 0 0.35rem' }}>
                Extrait de Parfum Longevity
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: 0 }}>
                High concentration fragrance oils lasting 12+ hours in tropical climates.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
