import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Search, Eye, Filter, CheckCircle2, Truck, Clock, X,
  AlertCircle, RefreshCw, ArrowLeft, Printer, MessageCircle, Check,
  Edit2, Save, Phone, Mail, MapPin, ExternalLink, FileText, ChevronRight
} from 'lucide-react';
import api, { getAssetUrl } from '../../api';
import { useSettings } from '../../context/SettingsContext';

const STATUS_TABS = [
  { id: 'all', label: 'All Orders' },
  { id: 'unfulfilled', label: 'Unfulfilled' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'In Transit' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' }
];

const COURIER_OPTIONS = [
  'Trax Logistics',
  'Call Courier',
  'TCS Express',
  'Leopards Courier',
  'PostEx',
  'M&P Express',
  'Daewoo Fastex',
  'Rider Courier',
  'Self Delivery'
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('all');
  const [search, setSearch] = useState('');
  
  // View mode: 'list' (Shopify orders table) | 'manage' (Shopify order detail & edit screen)
  const [viewMode, setViewMode] = useState('list');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: '', message: '' });

  // Editable form state for current order
  const [editForm, setEditForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    city: '',
    postal_code: '',
    order_status: 'pending',
    payment_status: 'pending',
    courier_name: 'Trax Logistics',
    tracking_number: '',
    admin_notes: '',
    order_notes: ''
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);

  const { formatPKR } = useSettings();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusTab === 'unfulfilled') {
        params.status = 'pending';
      } else if (statusTab !== 'all') {
        params.status = statusTab;
      }
      if (search) params.search = search;

      const res = await api.get('/orders', params);
      setOrders(res?.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusTab, search]);

  // Open Shopify-style Order Detail & Management Screen
  const openOrderManager = async (orderId) => {
    setDetailsLoading(true);
    setNotice({ type: '', message: '' });
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res?.data) {
        const o = res.data;
        setSelectedOrder(o);
        setEditForm({
          customer_name: o.customer_name || '',
          customer_phone: o.customer_phone || '',
          customer_email: o.customer_email || '',
          delivery_address: o.delivery_address || '',
          city: o.city || '',
          postal_code: o.postal_code || '',
          order_status: o.order_status || 'pending',
          payment_status: o.payment_status || 'pending',
          courier_name: o.courier_name || 'Trax Logistics',
          tracking_number: o.tracking_number || '',
          admin_notes: o.admin_notes || '',
          order_notes: o.order_notes || ''
        });
        setIsEditingAddress(false);
        setIsEditingCustomer(false);
        setViewMode('manage');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setNotice({ type: 'error', message: 'Failed to load order details.' });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Save changes to database via PUT /api/orders/:id
  const handleSaveOrder = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    setNotice({ type: '', message: '' });

    try {
      await api.put(`/orders/${selectedOrder.id}`, editForm);
      setNotice({ type: 'success', message: `Order #${selectedOrder.order_number} successfully updated and saved to database.` });
      
      // Update local selectedOrder state
      setSelectedOrder(prev => ({
        ...prev,
        ...editForm
      }));
      setIsEditingAddress(false);
      setIsEditingCustomer(false);
      fetchOrders();
    } catch (err) {
      setNotice({ type: 'error', message: err?.message || 'Failed to update order in database.' });
    } finally {
      setSaving(false);
    }
  };

  // Quick 1-click status advance
  const handleQuickStatus = async (newStatus) => {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      await api.put(`/orders/${selectedOrder.id}/status`, { status: newStatus });
      setEditForm(prev => ({ ...prev, order_status: newStatus }));
      setSelectedOrder(prev => ({ ...prev, order_status: newStatus }));
      setNotice({ type: 'success', message: `Order status advanced to "${newStatus}".` });
      fetchOrders();
    } catch (err) {
      setNotice({ type: 'error', message: err?.message || 'Failed to update status.' });
    } finally {
      setSaving(false);
    }
  };

  // Format Pakistani phone number for WhatsApp Web link
  const getWhatsAppLink = (phone, order) => {
    let clean = (phone || '').replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '92' + clean.slice(1);
    if (!clean.startsWith('92')) clean = '92' + clean;

    const itemsSummary = (order.items || [])
      .map(it => `• ${it.product_name} (Qty: ${it.quantity})`)
      .join('\n');

    const message = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customer_name}!\n\n` +
      `Thank you for ordering with *Al Muheet Fragrance*.\n` +
      `Your Cash on Delivery Order *#${order.order_number}* is being processed.\n\n` +
      `*Package Contents:*\n${itemsSummary}\n\n` +
      `*Total Cash Payable upon Delivery:* Rs. ${Number(order.total_amount).toLocaleString()}\n` +
      `*Delivery Address:* ${order.delivery_address}, ${order.city}\n\n` +
      `Please reply with *"CONFIRM"* to authorize dispatch with our courier service.`
    );

    return `https://wa.me/${clean}?text=${message}`;
  };

  // Print Invoice / Packing Slip
  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: '#F6F6F7', minHeight: '100vh', padding: '1.5rem', color: '#202223' }}>
      
      {/* Global Notice Banner */}
      {notice.message && (
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto 1.5rem',
            backgroundColor: notice.type === 'error' ? '#FDEDEC' : '#EDF7ED',
            border: `1px solid ${notice.type === 'error' ? '#F5C6CB' : '#C3E6CB'}`,
            borderRadius: '8px',
            padding: '0.85rem 1.25rem',
            color: notice.type === 'error' ? '#721C24' : '#155724',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.88rem',
            fontWeight: 600,
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {notice.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{notice.message}</span>
          </div>
          <button
            onClick={() => setNotice({ type: '', message: '' })}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0.2rem' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SHOPIFY ORDER DETAIL & MANAGEMENT VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'manage' && selectedOrder ? (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Top Bar: Breadcrumb, Title, Badges, & Action Buttons */}
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
            {/* Left: Breadcrumbs & Order Ref */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#4B5563',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={15} />
                <span>Orders</span>
              </button>

              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                #{selectedOrder.order_number}
              </h1>

              {/* Status Pills */}
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span
                  style={{
                    backgroundColor:
                      editForm.order_status === 'delivered' ? '#E3F1DF' :
                      editForm.order_status === 'shipped' ? '#EBF5FF' :
                      editForm.order_status === 'confirmed' ? '#FEF3C7' : '#F1F2F4',
                    color:
                      editForm.order_status === 'delivered' ? '#108043' :
                      editForm.order_status === 'shipped' ? '#1D4ED8' :
                      editForm.order_status === 'confirmed' ? '#B45309' : '#6D7175',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                >
                  {editForm.order_status === 'shipped' ? 'In Transit' : editForm.order_status}
                </span>

                <span
                  style={{
                    backgroundColor: editForm.payment_status === 'paid' ? '#E3F1DF' : '#FEF3C7',
                    color: editForm.payment_status === 'paid' ? '#108043' : '#B45309',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                >
                  {editForm.payment_status === 'paid' ? 'Paid' : 'Payment Pending (COD)'}
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              {/* WhatsApp Button */}
              <a
                href={getWhatsAppLink(editForm.customer_phone, selectedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 1px 3px rgba(37,211,102,0.3)'
                }}
              >
                <MessageCircle size={15} />
                <span>WhatsApp Customer</span>
              </a>

              {/* Print Slip */}
              <button
                onClick={handlePrintSlip}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                <Printer size={15} />
                <span>Print Invoice</span>
              </button>

              {/* Save Button */}
              <button
                onClick={handleSaveOrder}
                disabled={saving}
                style={{
                  backgroundColor: '#008060',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 1px 3px rgba(0,128,96,0.3)'
                }}
              >
                {saving ? (
                  <>
                    <RefreshCw size={14} className="spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Order</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Subtitle / Timestamp */}
          <p style={{ color: '#6D7175', fontSize: '0.82rem', margin: '0 0 1.5rem' }}>
            Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} from Online Storefront
          </p>

          {/* Shopify Polaris 2-Column Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
            
            {/* ========================================================= */}
            {/* LEFT MAIN COLUMN (~68%) */}
            {/* ========================================================= */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* 1. Fulfillment & Products Card */}
              <div className="shopify-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#F1F2F4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111827' }}>
                      <Truck size={15} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#111827' }}>
                        Fulfillment ({selectedOrder.items?.length || 0} Items)
                      </h3>
                      <span style={{ fontSize: '0.72rem', color: '#6D7175' }}>
                        Standard Cash on Delivery Shipping · {selectedOrder.city}
                      </span>
                    </div>
                  </div>

                  <span
                    style={{
                      backgroundColor: editForm.order_status === 'delivered' ? '#E3F1DF' : '#FEF3C7',
                      color: editForm.order_status === 'delivered' ? '#108043' : '#B45309',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}
                  >
                    {editForm.order_status === 'shipped' ? 'In Transit' : editForm.order_status}
                  </span>
                </div>

                {/* Line Items Table */}
                <div style={{ borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', padding: '0.75rem 0' }}>
                  {(selectedOrder.items || []).map((it, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 0',
                        borderBottom: idx < (selectedOrder.items.length - 1) ? '1px solid #F3F4F6' : 'none',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div
                          style={{
                            width: '52px',
                            height: '52px',
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
                            src={getAssetUrl(it.image_url)}
                            alt={it.product_name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '0.88rem' }}>
                            {it.product_name}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#6D7175', margin: '0.15rem 0 0', fontFamily: 'monospace' }}>
                            {it.sku || 'AM-FLACON'} · Qty: {it.quantity}
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 700, color: '#111827', margin: 0, fontSize: '0.92rem' }}>
                          {formatPKR(it.subtotal)}
                        </p>
                        <p style={{ fontSize: '0.72rem', color: '#6D7175', margin: '0.1rem 0 0' }}>
                          {formatPKR(it.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Courier & Tracking Manager (Shopify Style) */}
                <div style={{ marginTop: '1.25rem', backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827', margin: '0 0 0.75rem' }}>
                    Courier Shipping & Tracking Details
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                    <div>
                      <label className="shopify-label">Courier Service</label>
                      <select
                        value={editForm.courier_name}
                        onChange={(e) => setEditForm({ ...editForm, courier_name: e.target.value })}
                        className="shopify-input"
                        style={{ fontSize: '0.82rem' }}
                      >
                        {COURIER_OPTIONS.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="shopify-label">Tracking Number (CN / Waybill #)</label>
                      <input
                        type="text"
                        value={editForm.tracking_number}
                        onChange={(e) => setEditForm({ ...editForm, tracking_number: e.target.value })}
                        placeholder="e.g. TRX-9482710 or 78492019"
                        className="shopify-input"
                        style={{ fontSize: '0.82rem', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>

                  {editForm.tracking_number && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6D7175' }}>
                        Carrier: <strong>{editForm.courier_name}</strong> · CN: <strong>{editForm.tracking_number}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Payment & Financial Summary Card */}
              <div className="shopify-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 className="shopify-card-header" style={{ margin: 0 }}>
                    Payment (Cash on Delivery)
                  </h3>
                  <span
                    style={{
                      backgroundColor: editForm.payment_status === 'paid' ? '#E3F1DF' : '#FEF3C7',
                      color: editForm.payment_status === 'paid' ? '#108043' : '#B45309',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    {editForm.payment_status === 'paid' ? 'Paid in Full' : 'Pending Doorstep Payment'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                    <span>Subtotal</span>
                    <span>{formatPKR(selectedOrder.subtotal)}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4B5563' }}>
                    <span>Shipping Fee</span>
                    <span>{selectedOrder.shipping_fee > 0 ? formatPKR(selectedOrder.shipping_fee) : 'Free Shipping'}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #E5E7EB',
                      paddingTop: '0.85rem',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: '#111827'
                    }}
                  >
                    <span>Total Cash to Collect:</span>
                    <span style={{ color: '#DC2626' }}>{formatPKR(selectedOrder.total_amount)}</span>
                  </div>
                </div>

                {/* Payment Status Dropdown */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <label className="shopify-label" style={{ margin: 0 }}>Payment Status</label>
                    <span style={{ fontSize: '0.72rem', color: '#6D7175' }}>Has the courier deposited the cash?</span>
                  </div>

                  <select
                    value={editForm.payment_status}
                    onChange={(e) => setEditForm({ ...editForm, payment_status: e.target.value })}
                    className="shopify-input"
                    style={{ width: 'auto', minWidth: '180px', fontWeight: 600 }}
                  >
                    <option value="pending">Pending (Unpaid COD)</option>
                    <option value="paid">Paid (Cash Collected)</option>
                  </select>
                </div>
              </div>

              {/* 3. Merchant Internal Notes Card */}
              <div className="shopify-card">
                <h3 className="shopify-card-header">
                  Internal Staff Notes & Special Instructions
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="shopify-label">Merchant Notes (Internal Only)</label>
                  <textarea
                    rows={3}
                    value={editForm.admin_notes}
                    onChange={(e) => setEditForm({ ...editForm, admin_notes: e.target.value })}
                    placeholder="e.g., Called customer at 3 PM, confirmed order. Requested fragile courier sticker."
                    className="shopify-input"
                    style={{ fontFamily: 'inherit', resize: 'vertical' }}
                  />
                </div>

                {selectedOrder.order_notes && (
                  <div style={{ padding: '0.85rem', backgroundColor: '#FEF3C7', borderRadius: '6px', border: '1px solid #FCD34D' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E', margin: '0 0 0.2rem' }}>
                      Customer Checkout Note:
                    </p>
                    <p style={{ fontSize: '0.82rem', color: '#78350F', margin: 0 }}>
                      "{selectedOrder.order_notes}"
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* ========================================================= */}
            {/* RIGHT SIDEBAR COLUMN (~32%) */}
            {/* ========================================================= */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* 1. Order Status Card */}
              <div className="shopify-card">
                <h3 className="shopify-card-header">
                  Order Status
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label className="shopify-label">Dispatch / Order Stage</label>
                  <select
                    value={editForm.order_status}
                    onChange={(e) => setEditForm({ ...editForm, order_status: e.target.value })}
                    className="shopify-input"
                    style={{ fontWeight: 700 }}
                  >
                    <option value="pending">Pending Confirmation</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing / Packing</option>
                    <option value="shipped">In Transit (Dispatched)</option>
                    <option value="delivered">Delivered to Customer</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Quick Advance Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#6D7175', fontWeight: 700, textTransform: 'uppercase' }}>
                    Quick Status Actions
                  </span>
                  
                  {editForm.order_status !== 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatus('confirmed')}
                      style={{
                        textAlign: 'left',
                        padding: '0.45rem 0.75rem',
                        backgroundColor: '#FEF3C7',
                        border: '1px solid #FDE68A',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#92400E',
                        cursor: 'pointer'
                      }}
                    >
                      ✓ Mark as Confirmed
                    </button>
                  )}

                  {editForm.order_status !== 'shipped' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatus('shipped')}
                      style={{
                        textAlign: 'left',
                        padding: '0.45rem 0.75rem',
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#1E40AF',
                        cursor: 'pointer'
                      }}
                    >
                      🚚 Mark as Dispatched (In Transit)
                    </button>
                  )}

                  {editForm.order_status !== 'delivered' && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatus('delivered')}
                      style={{
                        textAlign: 'left',
                        padding: '0.45rem 0.75rem',
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#065F46',
                        cursor: 'pointer'
                      }}
                    >
                      ★ Mark as Delivered & Collected
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Customer Details Card */}
              <div className="shopify-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <h3 className="shopify-card-header" style={{ margin: 0 }}>
                    Customer
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditingCustomer(!isEditingCustomer)}
                    style={{ background: 'none', border: 'none', color: '#008060', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {isEditingCustomer ? 'Done' : 'Edit'}
                  </button>
                </div>

                {isEditingCustomer ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label className="shopify-label">Full Name</label>
                      <input
                        type="text"
                        value={editForm.customer_name}
                        onChange={(e) => setEditForm({ ...editForm, customer_name: e.target.value })}
                        className="shopify-input"
                      />
                    </div>
                    <div>
                      <label className="shopify-label">Phone Number</label>
                      <input
                        type="text"
                        value={editForm.customer_phone}
                        onChange={(e) => setEditForm({ ...editForm, customer_phone: e.target.value })}
                        className="shopify-input"
                      />
                    </div>
                    <div>
                      <label className="shopify-label">Email</label>
                      <input
                        type="email"
                        value={editForm.customer_email}
                        onChange={(e) => setEditForm({ ...editForm, customer_email: e.target.value })}
                        className="shopify-input"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111827', margin: '0 0 0.35rem' }}>
                      {editForm.customer_name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#008060', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      <Phone size={14} />
                      <a href={`tel:${editForm.customer_phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {editForm.customer_phone}
                      </a>
                    </div>
                    {editForm.customer_email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6D7175', fontSize: '0.78rem' }}>
                        <Mail size={14} />
                        <span>{editForm.customer_email}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Delivery / Shipping Address Card */}
              <div className="shopify-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <h3 className="shopify-card-header" style={{ margin: 0 }}>
                    Shipping Address
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    style={{ background: 'none', border: 'none', color: '#008060', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {isEditingAddress ? 'Done' : 'Edit'}
                  </button>
                </div>

                {isEditingAddress ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label className="shopify-label">Street / House Address</label>
                      <textarea
                        rows={2}
                        value={editForm.delivery_address}
                        onChange={(e) => setEditForm({ ...editForm, delivery_address: e.target.value })}
                        className="shopify-input"
                        style={{ fontFamily: 'inherit' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                      <div>
                        <label className="shopify-label">City</label>
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          className="shopify-input"
                        />
                      </div>
                      <div>
                        <label className="shopify-label">Postal Code</label>
                        <input
                          type="text"
                          value={editForm.postal_code}
                          onChange={(e) => setEditForm({ ...editForm, postal_code: e.target.value })}
                          className="shopify-input"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>
                    <p style={{ margin: '0 0 0.25rem' }}>{editForm.delivery_address}</p>
                    <p style={{ fontWeight: 700, margin: '0 0 0.25rem', color: '#111827' }}>
                      {editForm.city}, Pakistan
                    </p>
                    {editForm.postal_code && (
                      <p style={{ fontSize: '0.75rem', color: '#6D7175', margin: 0 }}>
                        Postal Code: {editForm.postal_code}
                      </p>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Bottom Save Bar */}
          <div
            style={{
              marginTop: '2rem',
              borderTop: '1px solid #D1D5DB',
              paddingTop: '1.25rem',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('list')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                padding: '0.6rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              Back to Orders
            </button>

            <button
              type="button"
              onClick={handleSaveOrder}
              disabled={saving}
              style={{
                backgroundColor: '#008060',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '0.6rem 1.75rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 1px 3px rgba(0,128,96,0.3)'
              }}
            >
              {saving ? 'Saving...' : 'Save Order Changes'}
            </button>
          </div>

        </div>
      ) : (
        /* ========================================================================= */
        /* 2. SHOPIFY ORDERS LIST VIEW */
        /* ========================================================================= */
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Header Title & Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.35rem', color: '#111827' }}>
                Orders
              </h1>
              <p style={{ color: '#6D7175', fontSize: '0.85rem', margin: 0 }}>
                Manage Cash on Delivery orders, courier dispatches, and doorstep payments.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                padding: '0.55rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#374151',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <RefreshCw size={14} />
              <span>Refresh Orders</span>
            </button>
          </div>

          {/* Shopify Orders Card Container */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E1E3E5',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            {/* Filter Tabs Bar (Shopify Style) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem 0',
                borderBottom: '1px solid #E1E3E5',
                overflowX: 'auto'
              }}
            >
              {STATUS_TABS.map(tab => {
                const isActive = statusTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStatusTab(tab.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid #008060' : '2px solid transparent',
                      padding: '0.55rem 0.85rem',
                      color: isActive ? '#008060' : '#6D7175',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      marginBottom: '-1px'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input Bar */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #E1E3E5', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Search size={16} style={{ color: '#6D7175' }} />
              <input
                type="text"
                placeholder="Filter orders by order #, customer name, phone, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.875rem',
                  color: '#202223',
                  width: '100%',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            {/* Orders Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E1E3E5', backgroundColor: '#F9FAFB', color: '#6D7175', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Order</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Date</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Total (COD)</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Payment</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Fulfillment</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Items</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '3.5rem', textAlign: 'center', color: '#008060', fontWeight: 600 }}>
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '3.5rem', textAlign: 'center', color: '#6D7175' }}>
                        No orders found in this view.
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr
                        key={order.id}
                        style={{ borderBottom: '1px solid #F1F2F4', transition: 'background-color 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {/* Order Ref */}
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span
                            onClick={() => openOrderManager(order.id)}
                            style={{ fontWeight: 700, color: '#008060', cursor: 'pointer', fontFamily: 'monospace' }}
                          >
                            #{order.order_number}
                          </span>
                        </td>

                        {/* Date */}
                        <td style={{ padding: '0.85rem 1rem', color: '#6D7175', fontSize: '0.78rem' }}>
                          {new Date(order.created_at).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                        </td>

                        {/* Customer */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <p style={{ fontWeight: 700, color: '#111827', margin: 0 }}>
                            {order.customer_name}
                          </p>
                          <p style={{ fontSize: '0.72rem', color: '#6D7175', margin: '0.1rem 0 0' }}>
                            {order.city} · {order.customer_phone}
                          </p>
                        </td>

                        {/* Total Amount */}
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#111827' }}>
                          {formatPKR(order.total_amount)}
                        </td>

                        {/* Payment Status */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span
                            style={{
                              backgroundColor: order.payment_status === 'paid' ? '#E3F1DF' : '#FEF3C7',
                              color: order.payment_status === 'paid' ? '#108043' : '#B45309',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              fontWeight: 700
                            }}
                          >
                            {order.payment_status === 'paid' ? 'Paid' : 'Pending COD'}
                          </span>
                        </td>

                        {/* Fulfillment Status */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span
                            style={{
                              backgroundColor:
                                order.order_status === 'delivered' ? '#E3F1DF' :
                                order.order_status === 'shipped' ? '#EBF5FF' :
                                order.order_status === 'confirmed' ? '#FEF3C7' : '#F1F2F4',
                              color:
                                order.order_status === 'delivered' ? '#108043' :
                                order.order_status === 'shipped' ? '#1D4ED8' :
                                order.order_status === 'confirmed' ? '#B45309' : '#6D7175',
                              padding: '0.15rem 0.55rem',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textTransform: 'capitalize'
                            }}
                          >
                            {order.order_status === 'shipped' ? 'In Transit' : order.order_status}
                          </span>
                        </td>

                        {/* Items */}
                        <td style={{ padding: '0.85rem 1rem', color: '#4B5563', fontSize: '0.78rem' }}>
                          {order.total_items} items
                        </td>

                        {/* Action */}
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <button
                            onClick={() => openOrderManager(order.id)}
                            style={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #D1D5DB',
                              borderRadius: '4px',
                              padding: '0.35rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#374151',
                              cursor: 'pointer'
                            }}
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

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
