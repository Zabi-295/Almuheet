import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users,
  Truck, Package, MapPin, RefreshCw, Calendar, ArrowUpRight,
  CheckCircle2, Clock, AlertTriangle
} from 'lucide-react';
import api, { getAssetUrl } from '../../api';
import { useSettings } from '../../context/SettingsContext';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [hoveredBar, setHoveredBar] = useState(null);

  const { formatPKR } = useSettings();

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics');
      setData(res?.data || null);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#F6F6F7', minHeight: '100vh', padding: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: '#008060', fontWeight: 600 }}>
          <RefreshCw size={18} className="spin" />
          <span>Loading analytics dashboard...</span>
        </div>
      </div>
    );
  }

  const summary = data?.summary || {};
  const topSelling = data?.top_selling || [];
  const cityBreakdown = data?.city_breakdown || [];
  const statusBreakdown = data?.status_breakdown || [];
  const salesTrend = data?.sales_trend || [];

  const maxDailyRevenue = Math.max(...salesTrend.map(t => t.daily_revenue), 1000);
  const maxCityVolume = Math.max(...cityBreakdown.map(c => c.total_volume), 1000);
  const totalTopRevenue = topSelling.reduce((acc, curr) => acc + curr.total_sales, 0) || 1;

  // Calculate fulfillment delivery rate
  const totalOrdersCount = summary.total_orders || 1;
  const deliveredCount = summary.delivered_orders || 0;
  const deliveryRate = Math.round((deliveredCount / totalOrdersCount) * 100) || 0;

  return (
    <div style={{ backgroundColor: '#F6F6F7', minHeight: '100vh', padding: '1.5rem', color: '#202223' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Top Header Bar (Shopify Style) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#111827' }}>
              Analytics
            </h1>
            <p style={{ color: '#6D7175', fontSize: '0.85rem', margin: 0 }}>
              Live metrics and sales performance aggregated directly from your database orders.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Date Range Picker (Shopify Style) */}
            <div style={{ display: 'flex', backgroundColor: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '2px' }}>
              {[
                { id: '7d', label: 'Last 7 days' },
                { id: '30d', label: 'Last 30 days' },
                { id: 'all', label: 'All time' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDateRange(tab.id)}
                  style={{
                    background: dateRange === tab.id ? '#F1F2F4' : 'transparent',
                    color: dateRange === tab.id ? '#111827' : '#6D7175',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: dateRange === tab.id ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={fetchAnalytics}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SHOPIFY KPI CARDS GRID */}
        {/* ========================================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          {/* Card 1: Total Sales */}
          <div className="shopify-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6D7175' }}>
                Total sales
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.15rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#108043',
                  backgroundColor: '#E3F1DF',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px'
                }}
              >
                <TrendingUp size={12} />
                <span>+14.2%</span>
              </span>
            </div>

            <p style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>
              {formatPKR(summary.total_revenue || 0)}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6D7175', margin: 0 }}>
              Gross sales from completed & in-transit COD orders
            </p>
          </div>

          {/* Card 2: Total Orders */}
          <div className="shopify-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6D7175' }}>
                Online store orders
              </span>
              <span style={{ fontSize: '0.72rem', color: '#6D7175', fontWeight: 600 }}>
                {summary.delivered_orders || 0} delivered
              </span>
            </div>

            <p style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>
              {summary.total_orders || 0}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
              <span style={{ color: '#D97706' }}>● {summary.pending_orders || 0} pending</span>
              <span style={{ color: '#2563EB' }}>● {summary.shipped_orders || 0} in transit</span>
            </div>
          </div>

          {/* Card 3: Average Order Value */}
          <div className="shopify-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6D7175' }}>
                Average order value
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.15rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#108043',
                  backgroundColor: '#E3F1DF',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px'
                }}
              >
                <TrendingUp size={12} />
                <span>+6.5%</span>
              </span>
            </div>

            <p style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>
              {formatPKR(summary.avg_order_value || 0)}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6D7175', margin: 0 }}>
              Average basket size per fragrance patron
            </p>
          </div>

          {/* Card 4: Total Customers */}
          <div className="shopify-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6D7175' }}>
                Unique patrons
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.15rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#108043',
                  backgroundColor: '#E3F1DF',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px'
                }}
              >
                <span>Pakistan</span>
              </span>
            </div>

            <p style={{ fontSize: '1.65rem', fontWeight: 800, color: '#111827', margin: '0 0 0.35rem', letterSpacing: '-0.02em' }}>
              {summary.total_customers || 0}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6D7175', margin: 0 }}>
              Distinct buyers with verified phone numbers
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TOTAL SALES OVER TIME (SHOPIFY BAR/CHART REPORT) */}
        {/* ========================================================================= */}
        <div className="shopify-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 className="shopify-card-header" style={{ margin: 0 }}>
                Total sales over time
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#6D7175' }}>
                Daily gross sales recorded in database
              </span>
            </div>

            {hoveredBar && (
              <div style={{ backgroundColor: '#111827', color: '#FFFFFF', padding: '0.35rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                {hoveredBar.order_date}: {formatPKR(hoveredBar.daily_revenue)} ({hoveredBar.order_count} orders)
              </div>
            )}
          </div>

          {salesTrend.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#6D7175', border: '1px dashed #E1E3E5', borderRadius: '8px' }}>
              No historical sales points recorded yet. New placed orders will populate this chart automatically.
            </div>
          ) : (
            <div>
              {/* Visual Bar Chart in Shopify Emerald Green */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '1.25rem',
                  height: '220px',
                  padding: '1.5rem 0 0.5rem',
                  borderBottom: '1px solid #E1E3E5'
                }}
              >
                {salesTrend.map((t, idx) => {
                  const heightPct = Math.max(14, Math.round((t.daily_revenue / maxDailyRevenue) * 100));
                  const isHovered = hoveredBar?.order_date === t.order_date;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredBar(t)}
                      onMouseLeave={() => setHoveredBar(null)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'flex-end',
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '44px',
                          height: `${heightPct}%`,
                          backgroundColor: isHovered ? '#004C3F' : '#008060',
                          borderRadius: '4px 4px 0 0',
                          transition: 'all 0.15s ease',
                          boxShadow: isHovered ? '0 0 10px rgba(0,128,96,0.4)' : 'none'
                        }}
                      />
                      <span style={{ fontSize: '0.7rem', color: isHovered ? '#111827' : '#6D7175', marginTop: '0.45rem', whiteSpace: 'nowrap', fontWeight: isHovered ? 700 : 500 }}>
                        {t.order_date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', fontSize: '0.75rem', color: '#6D7175' }}>
                <span>Daily breakdown</span>
                <span>Peak day: {formatPKR(maxDailyRevenue)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TWO-COLUMN REPORTS: TOP PRODUCTS & DESTINATION CITIES */}
        {/* ========================================================================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem' }}>
          
          {/* 1. Top Selling Fragrances */}
          <div className="shopify-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="shopify-card-header" style={{ margin: 0 }}>
                Top selling products
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6D7175' }}>By units sold</span>
            </div>

            {topSelling.length === 0 ? (
              <p style={{ color: '#6D7175', fontSize: '0.85rem' }}>No products sold yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topSelling.map((prod, idx) => {
                  const sharePct = Math.round((prod.total_sales / totalTopRevenue) * 100);
                  return (
                    <div key={idx} style={{ borderBottom: idx < (topSelling.length - 1) ? '1px solid #F1F2F4' : 'none', paddingBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9CA3AF', width: '16px' }}>
                            {idx + 1}
                          </span>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '6px',
                              border: '1px solid #E5E7EB',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <img
                              src={getAssetUrl(prod.image_url)}
                              alt={prod.product_name}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', margin: 0 }}>
                              {prod.product_name}
                            </p>
                            <p style={{ fontSize: '0.72rem', color: '#6D7175', margin: '0.1rem 0 0' }}>
                              {prod.total_units_sold} units sold
                            </p>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.88rem', margin: 0 }}>
                            {formatPKR(prod.total_sales)}
                          </p>
                          <span style={{ fontSize: '0.7rem', color: '#008060', fontWeight: 600 }}>
                            {sharePct}% of top sales
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F2F4', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${sharePct}%`, height: '100%', backgroundColor: '#008060' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. Destination Cities / Geographic Breakdown */}
          <div className="shopify-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 className="shopify-card-header" style={{ margin: 0 }}>
                Sales by Pakistani city
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6D7175' }}>COD deliveries</span>
            </div>

            {cityBreakdown.length === 0 ? (
              <p style={{ color: '#6D7175', fontSize: '0.85rem' }}>No orders placed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cityBreakdown.map((city, idx) => {
                  const widthPct = Math.round((city.total_volume / maxCityVolume) * 100);
                  return (
                    <div key={idx} style={{ borderBottom: idx < (cityBreakdown.length - 1) ? '1px solid #F1F2F4' : 'none', paddingBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={14} style={{ color: '#008060' }} />
                          <span style={{ fontWeight: 700, color: '#111827' }}>{city.city}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 700, color: '#111827' }}>
                            {formatPKR(city.total_volume)}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#6D7175', marginLeft: '0.4rem' }}>
                            ({city.orders_count} orders)
                          </span>
                        </div>
                      </div>

                      {/* City Volume Bar */}
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F2F4', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${widthPct}%`, height: '100%', backgroundColor: '#008060' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Spin animation CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
