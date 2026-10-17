import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function About() {
  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container-narrow">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            HAUTE PARFUMERIE HERITAGE
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
            The Essence of Al Muheet
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.2rem', maxWidth: '640px', margin: '0 auto' }}>
            "Al Muheet" translates to the vast, encompassing ocean — a tribute to the deep, enveloping sillage of authentic Arabian perfumery.
          </p>
        </div>

        {/* Story Content */}
        <div className="luxury-card" style={{ padding: '3rem 2.5rem', backgroundColor: '#FFFFFF', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.25rem', color: 'var(--gold-light)' }}>
            The Philosophy of High Concentration
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1rem' }}>
            Founded to counter the fleeting, watered-down commercial fragrances of mass retail, Al Muheet Fragrance was born with a single obsession: to formulate authentic, oil-dense <strong>Extrait de Parfum (30% to 35% concentration)</strong> that remains vibrant on fabric and skin long after sunset.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem', fontSize: '1rem' }}>
            We work directly with artisanal distillers in Assam for wild agarwood, Taif for dewy damask roses, and Grasse for the finest crystalline floral absolutes. Each blend matures in dark glass vessels for a minimum of 180 days, allowing the molecular accords to harmonize into an opulent olfactory symphony.
          </p>

          <div className="divider-gold" style={{ margin: '2.5rem 0' }} />

          <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--gold-light)' }}>
            Our Three Pillars of Excellence
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            <div>
              <div style={{ color: 'var(--gold-primary)', marginBottom: '0.75rem' }}>
                <Sparkles size={28} />
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Uncompromised Raw Oils</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Zero synthetic fillers. Sourced from sustainable heritage agarwood plantations and wild botanical harvests.
              </p>
            </div>

            <div>
              <div style={{ color: 'var(--gold-primary)', marginBottom: '0.75rem' }}>
                <Award size={28} />
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>French-Arabian Fusion</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Combining centuries-old Eastern attar distillation with European perfume pyramid structuring.
              </p>
            </div>

            <div>
              <div style={{ color: 'var(--gold-primary)', marginBottom: '0.75rem' }}>
                <HeartHandshake size={28} />
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>Trust & Transparency</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Nationwide Cash on Delivery across Pakistan. Inspect your parcel before paying the courier.
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/shop" className="btn btn-primary btn-lg">
            <span>Explore The Artisanal Catalog</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
