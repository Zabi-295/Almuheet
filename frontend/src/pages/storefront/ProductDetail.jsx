import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Clock, Sparkles, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import api, { getAssetUrl } from '../../api';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();
  const { formatPKR, settings } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${id}`);
        if (res?.data) {
          setProduct(res.data);
          setActiveImage(res.data.image_url);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center', color: 'var(--gold-light)' }}>
        <p style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>Unveiling fragrance formulation...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Fragrance Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>The requested fragrance may be out of stock or archived.</p>
        <Link to="/shop" className="btn btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  const galleryImages = [product.image_url, ...(product.gallery || [])].filter(Boolean);
  const isOutOfStock = product.stock_quantity <= 0;

  const handleInstantBuy = () => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        {/* Back Link */}
        <Link
          to="/shop"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '0.825rem',
            marginBottom: '2rem',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ChevronLeft size={16} />
          <span>Back to Fragrance Catalog</span>
        </Link>

        {/* Product Layout Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(1.5rem, 3.5vw, 3.5rem)',
            alignItems: 'flex-start'
          }}
        >
          {/* Gallery Column */}
          <div>
            {/* Main Active Image */}
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#FAFAFA',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-md)',
                height: 'clamp(320px, 48vw, 520px)'
              }}
            >
              <img
                src={getAssetUrl(activeImage || product.image_url)}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span className="badge badge-gold">
                  {product.concentration || 'Extrait de Parfum'}
                </span>
                {product.is_sample && (
                  <span className="badge badge-sample">
                    Sample Data
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails Row */}
            {galleryImages.length > 1 && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImage === img ? '2px solid var(--gold-primary)' : '1px solid var(--border-light)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      padding: 0,
                      opacity: activeImage === img ? 1 : 0.65,
                      transition: 'all 0.2s'
                    }}
                  >
                    <img src={getAssetUrl(img)} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="text-gold" style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.12em' }}>
                {product.category_name || 'Al Muheet Haute Parfumerie'}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {product.gender || 'Unisex'}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              {product.name}
            </h1>

            {/* Price Row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                {formatPKR(product.price)}
              </div>
              {product.compare_at_price && (
                <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {formatPKR(product.compare_at_price)}
                </div>
              )}
              <span className="badge badge-green">
                In Stock ({product.stock_quantity} available)
              </span>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              {product.description || product.short_description}
            </p>

            {/* Fragrance Pyramid Breakdown */}
            <div
              style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}
            >
              <h4 style={{ fontSize: '0.85rem', color: 'var(--gold-light)', letterSpacing: '0.15em', marginBottom: '1rem' }}>
                THE FRAGRANCE PYRAMID
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ width: '100px', color: 'var(--text-muted)', fontWeight: 600 }}>Top Notes:</span>
                  <span style={{ color: 'var(--text-main)', flex: 1 }}>{product.top_notes || 'Assam Agarwood, Bergamot'}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ width: '100px', color: 'var(--text-muted)', fontWeight: 600 }}>Heart Notes:</span>
                  <span style={{ color: 'var(--text-main)', flex: 1 }}>{product.heart_notes || 'Damask Rose, Smoked Amber'}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ width: '100px', color: 'var(--text-muted)', fontWeight: 600 }}>Base Notes:</span>
                  <span style={{ color: 'var(--text-main)', flex: 1 }}>{product.base_notes || 'Golden Ambergris, Dark Musk'}</span>
                </div>
              </div>

              {/* Performance Indicator */}
              <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: '1.25rem', fontSize: '0.8rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Longevity: </span>
                  <strong style={{ color: 'var(--gold-light)' }}>{product.longevity || '14+ Hours'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Sillage: </span>
                  <strong style={{ color: 'var(--gold-light)' }}>{product.sillage || 'Enveloping Heavy'}</strong>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
              {/* Quantity */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.85rem 1rem', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ padding: '0 1rem', fontWeight: 600 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  style={{ padding: '0.85rem 1rem', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={isOutOfStock}
                className="btn btn-outline btn-lg"
                style={{ flex: '1 1 180px' }}
              >
                <ShoppingBag size={18} />
                <span>Add to Bag</span>
              </button>

              {/* Instant Buy with COD */}
              <button
                onClick={handleInstantBuy}
                disabled={isOutOfStock}
                className="btn btn-primary btn-lg"
                style={{ flex: '1 1 240px' }}
              >
                <span>Buy Now · Cash on Delivery</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Pakistan COD Assurance Card */}
            <div
              style={{
                backgroundColor: 'rgba(212, 175, 55, 0.05)',
                border: '1px solid var(--border-gold-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.825rem',
                color: 'var(--text-secondary)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Truck size={18} style={{ color: 'var(--gold-primary)' }} />
                <span><strong>Cash on Delivery (COD):</strong> Pay cash when your parcel arrives anywhere in Pakistan.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={18} style={{ color: 'var(--gold-primary)' }} />
                <span><strong>Fast Delivery:</strong> 2-3 business days to Lahore, Karachi, Islamabad & Rawalpindi.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={18} style={{ color: 'var(--gold-primary)' }} />
                <span><strong>100% Authentic Flacon:</strong> Sealed with tamper-proof royal wax emblem.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
