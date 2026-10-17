import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowRight, ShoppingBag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import api, { getAssetUrl } from '../../api';

const PAKISTAN_CITIES = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur'
];

export default function Checkout() {
  const { items, subtotal, shippingFee, total, isFreeShipping, clearCart } = useCart();
  const { formatPKR, settings } = useSettings();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    city: 'Lahore',
    postal_code: '',
    order_notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
        <ShoppingBag size={48} style={{ color: 'var(--gold-primary)', margin: '0 auto 1.5rem' }} />
        <h2 style={{ marginBottom: '1rem' }}>Your Fragrance Bag is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please select a fragrance before proceeding to checkout.</p>
        <Link to="/shop" className="btn btn-primary">Browse Perfumes</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.customer_name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.customer_phone.trim() || formData.customer_phone.length < 10) {
      setError('Please enter a valid Pakistani mobile number (e.g., 0300-1234567).');
      return;
    }
    if (!formData.delivery_address.trim()) {
      setError('Please enter your complete street / house address.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please select or specify your delivery city.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        items: items.map(it => ({
          product_id: it.id,
          quantity: it.quantity
        }))
      };

      const res = await api.post('/orders', payload);
      if (res?.data?.order_number) {
        clearCart();
        navigate(`/order-confirmation/${res.data.order_number}`, { state: { order: res.data } });
      } else {
        throw new Error(res?.message || 'Failed to record your order.');
      }
    } catch (err) {
      setError(err?.message || 'An error occurred while creating your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            NATIONWIDE DISPATCH · PAKISTAN
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '0.06em' }}>
            Cash on Delivery Checkout
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            Zero advance payment required. Inspect parcel upon delivery and pay cash to the courier.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem 1.25rem',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem',
              maxWidth: '900px',
              margin: '0 auto 2rem'
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '3rem',
              alignItems: 'flex-start'
            }}
          >
            {/* Delivery Details Column */}
            <div
              className="luxury-card"
              style={{ padding: '2rem', backgroundColor: '#FFFFFF' }}
            >
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-light)' }}>
                <Truck size={20} />
                <span>1. Delivery Destination</span>
              </h3>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  placeholder="e.g. Hamza Tariq"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    placeholder="0300-1234567"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email (Optional)</label>
                  <input
                    type="email"
                    name="customer_email"
                    placeholder="name@example.com"
                    value={formData.customer_email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="form-select"
                >
                  {PAKISTAN_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="Other">Other City in Pakistan</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Complete Street Address *</label>
                <textarea
                  name="delivery_address"
                  placeholder="House / Apartment number, Street, Sector, Phase, Landmark..."
                  value={formData.delivery_address}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Special Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  name="order_notes"
                  placeholder="e.g. Call before arrival, leave with gatekeeper..."
                  value={formData.order_notes}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Payment Method Badge */}
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1.25rem',
                  backgroundColor: 'rgba(212,175,55,0.08)',
                  border: '1px solid var(--border-gold-subtle)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--gold-light)' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--gold-primary)' }} />
                    <span>Payment Method: Cash on Delivery (COD)</span>
                  </div>
                  <span className="badge badge-gold">Active</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Pay cash upon doorstep parcel inspection. No credit card or online payment required.
                </p>
              </div>
            </div>

            {/* Order Summary Column */}
            <div
              className="luxury-card"
              style={{ padding: '2rem', backgroundColor: '#FFFFFF' }}
            >
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--gold-light)' }}>
                2. Order Summary
              </h3>

              {/* Items in Cart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {items.map(it => (
                  <div key={it.id} style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <img
                      src={getAssetUrl(it.image_url)}
                      alt={it.name}
                      style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-gold-subtle)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.875rem' }}>{it.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Qty: {it.quantity} · {it.volume || '100ml'}
                      </p>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--gold-light)' }}>
                      {formatPKR(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider-gold" style={{ margin: '1rem 0' }} />

              {/* Pricing Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formatPKR(subtotal)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Delivery Charges (Pakistan)</span>
                  <span>
                    {isFreeShipping ? (
                      <strong style={{ color: '#4ade80' }}>FREE (Complimentary)</strong>
                    ) : (
                      <span>{formatPKR(shippingFee)}</span>
                    )}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>
                  <span>Total Amount Payable</span>
                  <span style={{ color: 'var(--gold-light)' }}>{formatPKR(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginBottom: '1.25rem' }}
              >
                {submitting ? (
                  <span>Securing Your Flacon...</span>
                ) : (
                  <>
                    <span>Confirm Order · Pay on Delivery</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={14} style={{ color: 'var(--gold-primary)' }} />
                <span>100% Authentic Handcrafted Fragrance Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
