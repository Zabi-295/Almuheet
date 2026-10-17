import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, MessageCircle, ArrowRight, ShieldCheck, Copy, Check } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api';

export default function OrderConfirmation() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [copied, setCopied] = useState(false);
  const { formatPKR, settings } = useSettings();

  useEffect(() => {
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/track`, { order_number: id });
          if (res?.data) {
            setOrder(res.data);
          }
        } catch (e) {
          console.warn('Could not load order tracking:', e);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  const copyOrderNumber = () => {
    if (order?.order_number || id) {
      navigator.clipboard.writeText(order?.order_number || id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappLink = `https://wa.me/${(settings.whatsapp_number || '923008472910').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Salam Al Muheet, I have placed order #${order?.order_number || id}. Please confirm dispatch status.`)}`;

  return (
    <div style={{ padding: '4rem 0 6rem' }}>
      <div className="container-narrow">
        <div
          className="luxury-card"
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--gold-border)',
            boxShadow: 'var(--shadow-gold)'
          }}
        >
          {/* Royal Seal / Success Icon */}
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              backgroundColor: 'rgba(179, 134, 27, 0.12)',
              border: '2px solid var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-light)'
            }}
          >
            <CheckCircle size={44} />
          </div>

          <span className="badge badge-gold" style={{ marginBottom: '0.75rem', letterSpacing: '0.15em' }}>
            ORDER CONFIRMED · CASH ON DELIVERY
          </span>

          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem' }}>
            Thank You For Choosing Al Muheet
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', maxWidth: '580px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
            Your bespoke flacon is being prepared by our perfumery artisans. Payment of {formatPKR(order?.total_amount || 0)} will be collected in cash upon doorstep delivery.
          </p>

          {/* Order Reference Box */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px dashed var(--gold-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.25rem',
              margin: '0 auto 2.5rem'
            }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Order Tracking Number
              </p>
              <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold-light)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>
                {order?.order_number || id}
              </p>
            </div>
            <button
              onClick={copyOrderNumber}
              className="btn btn-secondary btn-sm"
              title="Copy Order Number"
              style={{ padding: '0.5rem 0.75rem' }}
            >
              {copied ? <Check size={16} style={{ color: '#4ade80' }} /> : <Copy size={16} />}
            </button>
          </div>

          {/* Delivery & COD Breakdown Box */}
          <div
            style={{
              textAlign: 'left',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.5rem',
              maxWidth: '560px',
              margin: '0 auto 2.5rem',
              fontSize: '0.875rem'
            }}
          >
            <h4 style={{ fontSize: '0.9rem', color: 'var(--gold-light)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
              Dispatch & Payment Summary
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Recipient Name:</span>
                <span style={{ fontWeight: 600 }}>{order?.customer_name || 'Valued Customer'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Destination City:</span>
                <span style={{ fontWeight: 600 }}>{order?.city || order?.delivery_city || 'Pakistan'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
                <span style={{ color: '#4ade80', fontWeight: 600 }}>Cash on Delivery (COD)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Amount Payable:</span>
                <span style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '1rem' }}>
                  {formatPKR(order?.total_amount || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <MessageCircle size={18} />
              <span>WhatsApp Concierge</span>
            </a>

            <Link
              to={`/track-order?order_number=${encodeURIComponent(order?.order_number || id)}`}
              className="btn btn-primary"
            >
              <span>Track Real-Time Status</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
