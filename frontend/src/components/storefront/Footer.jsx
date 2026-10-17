import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, Phone, Mail, MapPin, Sparkles, Lock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-light)', paddingTop: '4rem', paddingBottom: '2.5rem' }}>
      <div className="container">
        {/* Value Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid var(--border-light)',
            marginBottom: '3rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>Cash on Delivery</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nationwide delivery across all Pakistani cities</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>Pure Extrait De Parfum</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>High concentration 30-35% pure perfume oils</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
              <Shield size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>Authenticity Guaranteed</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ethically sourced Assam oud & French florals</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--border-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
              <Phone size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>Bespoke Concierge</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>WhatsApp guidance & scent consultations</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
          {/* Brand Col */}
          <div>
            <img src="/logo.svg" alt="Al Muheet Fragrance" style={{ height: '48px', marginBottom: '1.2rem' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              {settings.store_tagline || 'The Pinnacle of Arabian & French Haute Parfumerie. Formulated with rare aged oils and handcrafted flacons.'}
            </p>
            <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
              Official Storefront · Pakistan
            </span>
          </div>

          {/* Quick Collections */}
          <div>
            <h4 style={{ fontSize: '0.95rem', letterSpacing: '0.1em', marginBottom: '1.25rem', color: 'var(--gold-light)' }}>
              COLLECTIONS
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/shop?category=executive-range" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>
                  Executive Range
                </Link>
              </li>
              <li>
                <Link to="/shop?category=royal-oud" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>
                  Royal Oud & Oriental
                </Link>
              </li>
              <li>
                <Link to="/shop?category=poetic-range" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>
                  Poetic Range
                </Link>
              </li>
              <li>
                <Link to="/shop?category=sensory-range" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>
                  Sensory Range
                </Link>
              </li>
              <li>
                <Link to="/shop?category=tester-box" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>
                  Discovery & Tester Sets
                </Link>
              </li>
              <li>
                <Link to="/shop" style={{ color: 'var(--gold-primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                  View All Perfumes →
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 style={{ fontSize: '0.95rem', letterSpacing: '0.1em', marginBottom: '1.25rem', color: 'var(--gold-light)' }}>
              CUSTOMER CARE
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/track-order" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
                  Track Your COD Order
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
                  The Art of Maceration
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
                  Fragrance Recommendations
                </Link>
              </li>
              <li>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Payment: Cash on Delivery (COD) Only
                </span>
              </li>
            </ul>
          </div>

          {/* Concierge & Address */}
          <div>
            <h4 style={{ fontSize: '0.95rem', letterSpacing: '0.1em', marginBottom: '1.25rem', color: 'var(--gold-light)' }}>
              CONCIERGE & BOUTIQUE
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '3px' }} />
                <span>{settings.store_address || 'Gulberg III, Lahore, Pakistan'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                <span>WhatsApp: {settings.whatsapp_number || '+92 300 8472910'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                <span>{settings.contact_email || 'concierge@almuheet.store'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <p>
            © {new Date().getFullYear()} {settings.store_name || 'Al Muheet Fragrance'}. Handcrafted in Pakistan. All rights reserved.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span>Cash on Delivery (PKR)</span>
            <span>•</span>
            <Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Lock size={12} />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
