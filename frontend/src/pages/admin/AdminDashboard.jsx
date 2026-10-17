import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowRight,
  Package,
  Boxes,
  Settings,
  Users,
  Eye,
  CheckCircle2
} from 'lucide-react';
import api, { getAssetUrl } from '../../api';
import { useSettings } from '../../context/SettingsContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPKR } = useSettings();

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [analyticsRes, ordersRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/orders')
        ]);
        setStats(analyticsRes?.data || null);
        setRecentOrders((ordersRes?.data || []).slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--gold-light)' }}>
        <p style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>Loading database analytics...</p>
      </div>
    );
  }

  const summary = stats?.summary || {};

  return (
    <div>
      {/* Welcome Title */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
            Store Intelligence & Overview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Real-time database performance for Cash on Delivery orders and inventory.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/products" className="btn btn-primary btn-sm">
            <Package size={15} />
            <span>Manage Products</span>
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            <ShoppingBag size={15} />
            <span>View All Orders</span>
          </Link>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        {/* Total Revenue */}
        <div className="luxury-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Total Revenue (PKR)
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(179,134,27,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '0.2rem' }}>
            {formatPKR(summary.total_revenue || 0)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Across {summary.total_orders || 0} lifetime COD orders
          </span>
        </div>

        {/* Average Order Value */}
        <div className="luxury-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Average Order Value
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.2rem' }}>
            {formatPKR(summary.avg_order_value || 0)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            High-ticket luxury basket size
          </span>
        </div>

        {/* Pending Orders */}
        <div className="luxury-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Pending Dispatch
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#d97706', marginBottom: '0.2rem' }}>
            {summary.pending_orders || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Orders awaiting packaging/courier
          </span>
        </div>

        {/* Low Stock Alert */}
        <div className="luxury-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Low Stock Warnings
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: summary.low_stock_count > 0 ? '#dc2626' : '#16a34a', marginBottom: '0.2rem' }}>
            {summary.low_stock_count || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Items below threshold of 10 units
          </span>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Top Selling Perfumes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
          alignItems: 'flex-start'
        }}
      >
        {/* Recent Orders Table */}
        <div className="luxury-card" style={{ padding: '1.75rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Recent COD Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', textDecoration: 'none' }}>
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No orders recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentOrders.map(order => (
                <div
                  key={order.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid var(--border-light)'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {order.order_number}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {order.customer_name} · {order.city}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 600, color: 'var(--gold-light)', fontSize: '0.9rem' }}>
                      {formatPKR(order.total_amount)}
                    </p>
                    <span
                      className={`badge ${
                        order.order_status === 'delivered' ? 'badge-green' :
                        order.order_status === 'shipped' ? 'badge-blue' :
                        order.order_status === 'pending' ? 'badge-amber' : 'badge-gold'
                      }`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {order.order_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Selling Fragrances */}
        <div className="luxury-card" style={{ padding: '1.75rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Top Selling Perfumes</h3>
            <Link to="/admin/analytics" style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', textDecoration: 'none' }}>
              Analytics →
            </Link>
          </div>

          {(stats?.top_selling || []).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No sales data available yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.top_selling.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid var(--border-light)'
                  }}
                >
                  <img
                    src={getAssetUrl(item.image_url)}
                    alt={item.product_name}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-gold-subtle)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.product_name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.total_units_sold} units sold
                    </p>
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--gold-light)', fontSize: '0.9rem' }}>
                    {formatPKR(item.total_sales)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
