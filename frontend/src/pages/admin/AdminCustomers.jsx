import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, Phone, MapPin, RefreshCw } from 'lucide-react';
import api from '../../api';
import { useSettings } from '../../context/SettingsContext';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { formatPKR } = useSettings();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers', { search });
      setCustomers(res?.data || []);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
            Customer Directory
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Directory of patrons across Pakistani cities with purchase frequency and total lifetime spend.
          </p>
        </div>

        <button onClick={fetchCustomers} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Search Input */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by customer name, phone number, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="luxury-card" style={{ backgroundColor: '#FFFFFF', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: '#FAFAFA', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '1rem 1.25rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Contact Phone</th>
              <th style={{ padding: '1rem' }}>City</th>
              <th style={{ padding: '1rem' }}>Delivery Address</th>
              <th style={{ padding: '1rem' }}>Orders Count</th>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Total Spent (PKR)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--gold-light)' }}>
                  Loading customer records...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No customer profiles found.
                </td>
              </tr>
            ) : (
              customers.map((c, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(212,175,55,0.12)', border: '1px solid var(--border-gold-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)', fontWeight: 600 }}>
                        {c.customer_name ? c.customer_name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.customer_name}</p>
                        {c.customer_email && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.customer_email}</p>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--gold-light)', fontFamily: 'monospace' }}>
                    {c.customer_phone}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {c.city}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.delivery_address}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                      {c.total_orders} Orders
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 700, color: 'var(--gold-light)' }}>
                    {formatPKR(c.total_spent)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
