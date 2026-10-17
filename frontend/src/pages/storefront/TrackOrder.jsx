import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle, Truck, MapPin, AlertCircle } from 'lucide-react';
import api from '../../api';
import { useSettings } from '../../context/SettingsContext';

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', desc: 'Received & awaiting concierge confirmation' },
  { key: 'confirmed', label: 'Confirmed', desc: 'Order verified for dispatch' },
  { key: 'processing', label: 'Artisanal Packaging', desc: 'Flacon inspected & wax-sealed' },
  { key: 'shipped', label: 'Out with Courier', desc: 'Dispatched via nationwide courier' },
  { key: 'delivered', label: 'Delivered', desc: 'Handed over & payment collected' }
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order_number') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { formatPKR } = useSettings();

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please provide your Order Number (e.g., AM-2026-1001).');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await api.get('/orders/track', {
        order_number: orderNumber.trim(),
        phone: phone.trim()
      });
      if (res?.data) {
        setOrder(res.data);
      } else {
        setError('No order found with the provided details.');
      }
    } catch (err) {
      setError(err?.message || 'Order not found. Please verify your order number and phone number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      handleTrack();
    }
  }, []);

  const getStepIndex = (status) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(order?.order_status);

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container-narrow">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            ORDER DISPATCH CONCIERGE
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            Track Your Fragrance
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
            Check the live progress of your Cash on Delivery parcel across Pakistan.
          </p>
        </div>

        {/* Search Card */}
        <div
          className="luxury-card"
          style={{ padding: '2rem', backgroundColor: '#FFFFFF', marginBottom: '3rem' }}
        >
          <form onSubmit={handleTrack} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Order Number *</label>
              <input
                type="text"
                placeholder="e.g. AM-2026-A72B24"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number (Optional)</label>
              <input
                type="text"
                placeholder="0300-1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ height: '46px' }}
            >
              <Search size={16} />
              <span>{loading ? 'Searching...' : 'Track Parcel'}</span>
            </button>
          </form>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2rem'
            }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details & Progress Timeline */}
        {order && (
          <div
            className="luxury-card animate-fade-in"
            style={{ padding: '2.5rem', backgroundColor: '#FFFFFF', border: '1px solid var(--gold-border)' }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>
                  ORDER #{order.order_number}
                </span>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  Placed on {new Date(order.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-green" style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>
                  Status: {order.order_status}
                </span>
                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-light)', marginTop: '0.25rem' }}>
                  {formatPKR(order.total_amount)} (COD)
                </p>
              </div>
            </div>

            {/* Visual Timeline */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? 'var(--gold-primary)' : '#F0EBE0',
                          color: isDone ? '#0E0E12' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          marginBottom: '0.6rem',
                          boxShadow: isCurrent ? '0 0 15px var(--gold-glow)' : 'none',
                          border: isCurrent ? '2px solid var(--gold-primary)' : 'none'
                        }}
                      >
                        {isDone ? <CheckCircle size={20} /> : idx + 1}
                      </div>
                      <p style={{ fontSize: '0.85rem', fontWeight: isDone ? 600 : 400, color: isDone ? 'var(--text-main)' : 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        {step.label}
                      </p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recipient Information */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                backgroundColor: '#FAFAFA',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                padding: '1.5rem',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--gold-light)', marginBottom: '0.6rem' }}>
                  Recipient
                </h4>
                <p style={{ fontWeight: 600 }}>{order.customer_name}</p>
                <p style={{ color: 'var(--text-muted)' }}>{order.customer_phone}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--gold-light)', marginBottom: '0.6rem' }}>
                  Delivery Address
                </h4>
                <p>{order.delivery_address}</p>
                <p style={{ color: 'var(--gold-primary)', fontWeight: 600 }}>{order.city}, Pakistan</p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--gold-light)', marginBottom: '0.6rem' }}>
                  Payment Method
                </h4>
                <p style={{ color: '#4ade80', fontWeight: 600 }}>Cash on Delivery (COD)</p>
                <p style={{ color: 'var(--text-muted)' }}>Pay exact amount upon courier arrival</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
