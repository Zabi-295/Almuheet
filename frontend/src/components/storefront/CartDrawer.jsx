import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { getAssetUrl } from '../../api';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    isFreeShipping,
    amountForFreeShipping,
    freeShippingProgress,
    total,
    shippingFee
  } = useCart();
  const { formatPKR } = useSettings();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Dark Overlay Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(5px)',
          animation: 'fadeIn 0.25s ease-out'
        }}
      />

      {/* Slide-in Drawer Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderLeft: '1px solid var(--border-gold-subtle)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 101,
          animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drawer Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--gold-primary)' }} />
            <h3 style={{ fontSize: '1.1rem', letterSpacing: '0.08em' }}>Your Fragrance Bag</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.3rem' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(212, 175, 55, 0.06)', borderBottom: '1px solid var(--border-gold-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
            <Truck size={16} style={{ color: 'var(--gold-primary)' }} />
            {isFreeShipping ? (
              <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
                ✨ You've unlocked Complimentary Nationwide Delivery!
              </span>
            ) : (
              <span style={{ color: 'var(--text-secondary)' }}>
                Add <strong style={{ color: 'var(--gold-light)' }}>{formatPKR(amountForFreeShipping)}</strong> more for Free Delivery
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                background: 'var(--gold-gradient)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Item List or Empty State */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {items.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 1.25rem', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <ShoppingBag size={28} />
              </div>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Your Bag is Empty</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Discover our royal Assamese oud and French Extrait de Parfum creations.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="btn btn-outline btn-sm"
              >
                Browse Perfumes
              </button>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-light)'
                }}
              >
                <img
                  src={getAssetUrl(item.image_url)}
                  alt={item.name}
                  style={{
                    width: '74px',
                    height: '74px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-gold-subtle)'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{item.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    {item.volume || '100ml'} · {item.concentration || 'Extrait de Parfum'}
                  </p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gold-light)' }}>
                    {formatPKR(item.price)}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem' }}>
                    {/* Quantity Selector */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '0.25rem 0.5rem', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.8rem', padding: '0 0.5rem', minWidth: '24px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '0.25rem 0.5rem', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Remove Item */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.2rem'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                      title="Remove from bag"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Summary */}
        {items.length > 0 && (
          <div style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formatPKR(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Delivery (Pakistan COD)</span>
              <span>
                {isFreeShipping ? (
                  <strong style={{ color: '#4ade80' }}>FREE</strong>
                ) : (
                  <span>{formatPKR(shippingFee)}</span>
                )}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', fontSize: '1.05rem', fontWeight: 700 }}>
              <span>Estimated Total</span>
              <span style={{ color: 'var(--gold-light)' }}>{formatPKR(total)}</span>
            </div>

            <div style={{ backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: 'var(--radius-sm)', padding: '0.65rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--gold-light)' }}>
              <Sparkles size={14} style={{ flexShrink: 0 }} />
              <span>Cash on Delivery Only · Pay upon doorstep parcel inspection</span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <span>Cash on Delivery Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
