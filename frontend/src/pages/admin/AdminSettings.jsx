import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import api from '../../api';

export default function AdminSettings() {
  const { settings, reloadSettings } = useSettings();
  const [formData, setFormData] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: '', message: '' });

  React.useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice({ type: '', message: '' });

    try {
      await api.put('/settings', formData);
      await reloadSettings();
      setNotice({ type: 'success', message: 'Store settings and brand configuration updated successfully in database!' });
    } catch (err) {
      setNotice({ type: 'error', message: err?.message || 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
            Store Configuration & Brand Settings
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            All settings are persisted to the database and dynamically applied across the storefront and Cash on Delivery calculations.
          </p>
        </div>
      </div>

      {notice.message && (
        <div
          style={{
            backgroundColor: notice.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
            border: `1px solid ${notice.type === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '0.85rem 1.25rem',
            color: notice.type === 'error' ? '#fca5a5' : '#86efac',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          {notice.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{notice.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '850px' }}>
        {/* Brand & Identity */}
        <div className="luxury-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--gold-light)', marginBottom: '1.25rem' }}>
            1. Brand Identity & Store Presentation
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Official Store Name *</label>
              <input
                type="text"
                name="store_name"
                required
                value={formData.store_name || ''}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Currency Symbol *</label>
              <input
                type="text"
                name="currency"
                required
                value={formData.currency || 'PKR'}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Store Tagline & Subheading</label>
            <input
              type="text"
              name="store_tagline"
              value={formData.store_tagline || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Top Announcement Banner</label>
            <input
              type="text"
              name="announcement_banner"
              value={formData.announcement_banner || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Pakistan Cash on Delivery & Shipping Rules */}
        <div className="luxury-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--gold-light)', marginBottom: '1.25rem' }}>
            2. Cash on Delivery (COD) & Courier Shipping Rules
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Standard Delivery Charge (PKR)</label>
              <input
                type="number"
                name="shipping_fee"
                value={formData.shipping_fee || '250'}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Free Delivery Minimum Threshold (PKR)</label>
              <input
                type="number"
                name="free_shipping_threshold"
                value={formData.free_shipping_threshold || '6000'}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Cash on Delivery Policy Note</label>
            <textarea
              rows={2}
              name="cod_policy_note"
              value={formData.cod_policy_note || ''}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Concierge Contact Details */}
        <div className="luxury-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--gold-light)', marginBottom: '1.25rem' }}>
            3. Customer Care & Concierge Channels
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Concierge Email</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email || ''}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Direct Phone</label>
              <input
                type="text"
                name="contact_phone"
                value={formData.contact_phone || ''}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Helpline</label>
              <input
                type="text"
                name="whatsapp_number"
                value={formData.whatsapp_number || ''}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Boutique / Physical Atelier Address</label>
            <input
              type="text"
              name="store_address"
              value={formData.store_address || ''}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
        >
          <Save size={18} />
          <span>{saving ? 'Saving Changes...' : 'Save & Publish Store Settings'}</span>
        </button>
      </form>
    </div>
  );
}
