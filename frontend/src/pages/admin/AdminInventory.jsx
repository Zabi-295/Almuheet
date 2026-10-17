import React, { useState, useEffect } from 'react';
import { Boxes, Plus, Minus, AlertTriangle, History, RefreshCw, X, ArrowUpDown } from 'lucide-react';
import api from '../../api';
import { useSettings } from '../../context/SettingsContext';

export default function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('10');
  const [adjustType, setAdjustType] = useState('manual_restock');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const { formatPKR } = useSettings();

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const [invRes, logsRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/inventory/logs')
      ]);
      setInventory(invRes?.data || []);
      setLogs(logsRes?.data || []);
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const openAdjustModal = (item, defaultDirection = 1) => {
    setSelectedProduct(item);
    setAdjustAmount(defaultDirection === 1 ? '10' : '-1');
    setAdjustType(defaultDirection === 1 ? 'manual_restock' : 'damaged');
    setAdjustNotes('');
    setIsModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const amount = parseInt(adjustAmount, 10);
    if (isNaN(amount) || amount === 0) {
      setNotice({ type: 'error', message: 'Please enter a valid non-zero adjustment amount.' });
      return;
    }

    try {
      const res = await api.post('/inventory/adjust', {
        product_id: selectedProduct.id,
        change_amount: amount,
        type: adjustType,
        notes: adjustNotes || 'Stock adjustment via Admin Inventory'
      });
      setNotice({ type: 'success', message: res?.message || 'Inventory updated successfully.' });
      setIsModalOpen(false);
      fetchInventoryData();
    } catch (err) {
      setNotice({ type: 'error', message: err?.message || 'Failed to adjust stock.' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
            Inventory & Stock Auditing
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Track physical flacon stock levels, restock batches, and view audit history logs.
          </p>
        </div>

        <button onClick={fetchInventoryData} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} />
          <span>Refresh Stock</span>
        </button>
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
            justifyContent: 'space-between'
          }}
        >
          <span>{notice.message}</span>
          <button onClick={() => setNotice({ type: '', message: '' })} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Current Stock Levels Table */}
      <div className="luxury-card" style={{ backgroundColor: '#FFFFFF', marginBottom: '3rem', overflowX: 'auto' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Boxes size={18} style={{ color: 'var(--gold-primary)' }} />
          <h3 style={{ fontSize: '1.1rem' }}>Active Stock Reserves</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: '#FAFAFA', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '1rem 1.25rem' }}>SKU</th>
              <th style={{ padding: '1rem' }}>Fragrance</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Unit Price (PKR)</th>
              <th style={{ padding: '1rem' }}>Current Stock</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Quick Adjust</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--gold-light)' }}>
                  Calculating inventory...
                </td>
              </tr>
            ) : inventory.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No inventory products found.
                </td>
              </tr>
            ) : (
              inventory.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    {item.sku}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>
                    {item.name}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {item.category_name || 'Unassigned'}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--gold-light)', fontWeight: 600 }}>
                    {formatPKR(item.price)}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '1rem', fontWeight: 700 }}>
                    {item.stock_quantity}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {item.is_low_stock ? (
                      <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertTriangle size={12} />
                        <span>Low Stock</span>
                      </span>
                    ) : (
                      <span className="badge badge-green">In Stock</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => openAdjustModal(item, 1)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.65rem' }}
                        title="Restock (+ Units)"
                      >
                        <Plus size={14} />
                        <span>Restock</span>
                      </button>
                      <button
                        onClick={() => openAdjustModal(item, -1)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.65rem', color: '#f87171' }}
                        title="Deduct / Correction (- Units)"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inventory Audit Trail Logs */}
      <div className="luxury-card" style={{ backgroundColor: '#FFFFFF', overflowX: 'auto' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <History size={18} style={{ color: 'var(--gold-primary)' }} />
          <h3 style={{ fontSize: '1.1rem' }}>Inventory Activity & Audit Trail (Last 50 Events)</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: '#FAFAFA', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <th style={{ padding: '1rem 1.25rem' }}>Timestamp</th>
              <th style={{ padding: '1rem' }}>Fragrance</th>
              <th style={{ padding: '1rem' }}>Change</th>
              <th style={{ padding: '1rem' }}>New Stock</th>
              <th style={{ padding: '1rem' }}>Audit Type</th>
              <th style={{ padding: '1rem 1.25rem' }}>Notes / Context</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No inventory change events logged yet.
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {log.created_at}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>
                    {log.product_name}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: log.change_amount > 0 ? '#15803d' : '#dc2626' }}>
                    {log.change_amount > 0 ? `+${log.change_amount}` : log.change_amount}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--gold-light)', fontWeight: 600 }}>
                    {log.new_stock}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
                      {log.type}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                    {log.notes || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {isModalOpen && selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(5px)' }} />

          <div
            className="luxury-card"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--gold-border)',
              padding: '2rem',
              zIndex: 111
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--gold-light)' }}>
                  Adjust Stock: {selectedProduct.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Current Stock Level: <strong>{selectedProduct.stock_quantity} units</strong>
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit}>
              <div className="form-group">
                <label className="form-label">Change Quantity (+ to add, - to deduct) *</label>
                <input
                  type="number"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="form-input"
                  placeholder="e.g. 20 or -5"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Audit Reason Type</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="form-select"
                >
                  <option value="manual_restock">Manual Restock (New Batch Inward)</option>
                  <option value="correction">Inventory Physical Count Correction</option>
                  <option value="damaged">Damaged / Tester Flacon Outward</option>
                  <option value="other">Other Operational Reason</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Audit Notes (Optional)</label>
                <input
                  type="text"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Batch #409 received from Lahore laboratory"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
