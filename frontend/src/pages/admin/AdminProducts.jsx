import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Search, Upload, AlertCircle, CheckCircle,
  RefreshCw, Sparkles, X, ArrowLeft, Image as ImageIcon, Check,
  DollarSign, Tag, Layers, Eye, ExternalLink, HelpCircle
} from 'lucide-react';
import api, { getAssetUrl } from '../../api';
import { useSettings } from '../../context/SettingsContext';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // View mode: 'list' (catalog table) | 'editor' (Shopify-style product creation/edit)
  const [viewMode, setViewMode] = useState('list');
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState({ type: '', message: '' });

  const { formatPKR } = useSettings();

  const initialForm = {
    name: '',
    slug: '',
    category_id: '',
    price: '',
    compare_at_price: '',
    cost_per_item: '',
    stock_quantity: '25',
    sku: '',
    barcode: '',
    image_url: '/images/autumn-hero.jpg',
    volume: '100ml',
    concentration: 'Extrait de Parfum (35% Oil)',
    gender: 'Unisex',
    short_description: '',
    description: '',
    top_notes: '',
    heart_notes: '',
    base_notes: '',
    longevity: '14+ Hours',
    sillage: 'Strong / Enveloping',
    status: 'active', // 'active' | 'draft'
    is_featured: true,
    tags: 'Autumn Drop, Luxury, Best Seller'
  };

  const [formData, setFormData] = useState(initialForm);

  // Available high-resolution flacon presets for quick selection
  const flaconPresets = [
    { name: 'Autumn Story (Gold Amber)', url: '/images/autumn-hero.jpg' },
    { name: 'Catch 22 (Emerald Glass)', url: '/images/executive-green.jpg' },
    { name: 'Smash My Head (Blush Rose)', url: '/images/executive-pink.jpg' },
    { name: 'Merry Me Intense (Sapphire)', url: '/images/sapphire-smoke.jpg' },
    { name: 'Royal Oud Al-Malaki (Black & Gold)', url: '/images/royal-oud.jpg' },
    { name: 'Arabian Eagle (Eagle Emblem)', url: '/images/arabian-eagle.jpg' },
    { name: 'Signature Attar 8ML (Pure Oil)', url: '/images/signature-attar.jpg' },
    { name: 'Discovery Tester Set (3x10ml)', url: '/images/discovery-set.jpg' },
    { name: 'Rose de Taif (Velvet Red)', url: '/images/rose-taif.jpg' },
    { name: 'Velvet Musk (Ivory Flacon)', url: '/images/musk-cashmere.jpg' },
    { name: 'Perfume Wax Compact', url: '/images/perfume-wax.jpg' },
    { name: 'Artisanal Air Care Diffuser', url: '/images/air-care.jpg' }
  ];

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products', { search }),
        api.get('/categories')
      ]);
      setProducts(prodRes?.data || []);
      setCategories(catRes?.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [search]);

  // Open Shopify-style Product Creator
  const openCreateEditor = () => {
    setEditingProduct(null);
    const randomSku = 'AM-' + Math.floor(100 + Math.random() * 900);
    setFormData({
      ...initialForm,
      category_id: categories[0]?.id || '1',
      sku: randomSku,
      status: 'active'
    });
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Shopify-style Product Editor with existing data
  const openEditEditor = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      slug: prod.slug || '',
      category_id: prod.category_id || '',
      price: prod.price || '',
      compare_at_price: prod.compare_at_price || '',
      cost_per_item: prod.cost_per_item || '',
      stock_quantity: prod.stock_quantity ?? 0,
      sku: prod.sku || '',
      barcode: prod.barcode || '',
      image_url: prod.image_url || '/images/royal-oud.jpg',
      volume: prod.volume || '100ml',
      concentration: prod.concentration || 'Extrait de Parfum',
      gender: prod.gender || 'Unisex',
      short_description: prod.short_description || '',
      description: prod.description || '',
      top_notes: prod.top_notes || '',
      heart_notes: prod.heart_notes || '',
      base_notes: prod.base_notes || '',
      longevity: prod.longevity || '14+ Hours',
      sillage: prod.sillage || 'Strong / Enveloping',
      status: 'active',
      is_featured: !!prod.is_featured,
      tags: prod.tags || 'Luxury Fragrance, Extrait de Parfum'
    });
    setViewMode('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateSku = () => {
    const prefix = formData.name
      ? formData.name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()
      : 'AM';
    const randNum = Math.floor(100 + Math.random() * 900);
    setFormData(prev => ({ ...prev, sku: `AM-${prefix}-${randNum}` }));
  };

  // File upload to backend API (persists in backend/uploads and syncs to frontend/public/uploads)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setNotice({ type: '', message: '' });
    try {
      const res = await api.upload(file);
      if (res?.data?.url) {
        setFormData(prev => ({ ...prev, image_url: res.data.url }));
        setNotice({ type: 'success', message: 'Flacon image uploaded successfully to server!' });
      }
    } catch (err) {
      setNotice({ type: 'error', message: err?.message || 'Failed to upload image file.' });
    } finally {
      setUploading(false);
    }
  };

  // Drag & drop file handler
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const syntheticEvent = { target: { files: e.dataTransfer.files } };
      handleImageUpload(syntheticEvent);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Save product directly into SQLite database
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setNotice({ type: '', message: '' });

    if (!formData.name.trim()) {
      setNotice({ type: 'error', message: 'Product title is required.' });
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setNotice({ type: 'error', message: 'A valid selling price (PKR) is required.' });
      return;
    }
    if (!formData.sku.trim()) {
      handleGenerateSku();
    }

    setSaving(true);
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);
        setNotice({ type: 'success', message: `Fragrance "${formData.name}" updated in database.` });
      } else {
        await api.post('/products', formData);
        setNotice({ type: 'success', message: `Fragrance "${formData.name}" successfully created and saved to database!` });
      }
      await fetchCatalog();
      setViewMode('list');
    } catch (err) {
      setNotice({ type: 'error', message: err?.message || 'Error saving product to database.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the database?`)) return;

    try {
      await api.delete(`/products/${id}`);
      setNotice({ type: 'success', message: `Product "${name}" deleted from database.` });
      fetchCatalog();
    } catch (err) {
      setNotice({ type: 'error', message: err?.message || 'Failed to delete product.' });
    }
  };

  const handleClearSampleData = async () => {
    if (!window.confirm('Are you sure you want to remove all initial local sample perfume products?')) return;

    try {
      const res = await api.post('/products/clear-samples');
      setNotice({ type: 'success', message: res?.message || 'Sample products cleared.' });
      fetchCatalog();
    } catch (err) {
      setNotice({ type: 'error', message: err?.message || 'Failed to clear sample products.' });
    }
  };

  // Margin calculation helper
  const calculateMargin = () => {
    const price = Number(formData.price || 0);
    const cost = Number(formData.cost_per_item || 0);
    if (price > 0 && cost > 0 && price >= cost) {
      const profit = price - cost;
      const margin = Math.round((profit / price) * 100);
      return { profit, margin };
    }
    return null;
  };

  const marginData = calculateMargin();

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
            {notice.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
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
      {/* 1. SHOPIFY PRODUCT CREATION / EDIT VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'editor' ? (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Shopify Polaris Top Bar */}
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
            {/* Left Breadcrumb & Page Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                <span>Products</span>
              </button>

              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                {editingProduct ? `Edit ${editingProduct.name}` : 'Add product'}
              </h1>

              <span
                style={{
                  backgroundColor: formData.status === 'active' ? '#E3F1DF' : '#F1F2F4',
                  color: formData.status === 'active' ? '#108043' : '#6D7175',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                {formData.status === 'active' ? 'Active' : 'Draft'}
              </span>
            </div>

            {/* Right Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  padding: '0.55rem 1.1rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#374151',
                  cursor: 'pointer'
                }}
              >
                Discard
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  backgroundColor: '#008060',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.55rem 1.35rem',
                  fontSize: '0.85rem',
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
                    <RefreshCw size={15} className="spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Save product</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Shopify 2-Column Grid (Main 68% / Sidebar 32%) */}
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
              
              {/* ========================================================= */}
              {/* MAIN CONTENT COLUMN (LEFT) */}
              {/* ========================================================= */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* 1. Title & Description Card */}
                <div className="shopify-card">
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="shopify-label">
                      Title <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Short sleeve t-shirt, Autumn Story Extrait de Parfum..."
                      className="shopify-input"
                      style={{ fontSize: '0.95rem', fontWeight: 600 }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label className="shopify-label" style={{ margin: 0 }}>
                        Description
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            description: `${prev.description ? prev.description + '\n\n' : ''}Crafted with rare natural essences, offering a luxurious scent trail that evolves gracefully across hours.`
                          }));
                        }}
                        style={{ background: 'none', border: 'none', color: '#008060', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        + Insert Template
                      </button>
                    </div>

                    <textarea
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the perfume character, inspiration, and mood..."
                      className="shopify-input"
                      style={{ fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* 2. Media Card (Official Shopify Dropzone & Flacon Presets) */}
                <div className="shopify-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 className="shopify-card-header" style={{ margin: 0 }}>
                      Media
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#6D7175' }}>
                      Accepts JPG, PNG, WebP
                    </span>
                  </div>

                  {/* Dropzone Area */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="shopify-dropzone"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: '#F1F2F4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#5C5F62'
                        }}
                      >
                        <Upload size={20} />
                      </div>

                      <div>
                        <label
                          style={{
                            display: 'inline-block',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #C9CCCF',
                            borderRadius: '6px',
                            padding: '0.45rem 1rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#202223',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}
                        >
                          {uploading ? 'Uploading image...' : 'Add files'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                        <p style={{ fontSize: '0.78rem', color: '#6D7175', margin: '0.5rem 0 0' }}>
                          or drop files here to upload
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Active Selected Media Preview */}
                  {formData.image_url && (
                    <div
                      style={{
                        marginTop: '1.25rem',
                        padding: '1rem',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
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
                            src={getAssetUrl(formData.image_url)}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827' }}>
                              Primary Media
                            </span>
                            <span style={{ backgroundColor: '#E3F1DF', color: '#108043', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                              SELECTED
                            </span>
                          </div>
                          <p style={{ fontSize: '0.72rem', color: '#6B7280', margin: '0.2rem 0 0', wordBreak: 'break-all' }}>
                            {formData.image_url}
                          </p>
                        </div>
                      </div>

                      <label
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          color: '#374151',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>
                  )}

                  {/* Preset Luxury Flacon Gallery Selector */}
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827', margin: '0 0 0.75rem' }}>
                      Or choose from Al Muheet Flacon Presets:
                    </p>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gap: '0.75rem'
                      }}
                    >
                      {flaconPresets.map((preset, idx) => {
                        const isSelected = formData.image_url === preset.url;
                        return (
                          <div
                            key={idx}
                            onClick={() => setFormData(prev => ({ ...prev, image_url: preset.url }))}
                            style={{
                              border: isSelected ? '2px solid #008060' : '1px solid #E5E7EB',
                              borderRadius: '8px',
                              padding: '0.5rem',
                              backgroundColor: isSelected ? '#F6FDF9' : '#FFFFFF',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ width: '56px', height: '56px', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img
                                src={preset.url}
                                alt={preset.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            </div>
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: isSelected ? '#008060' : '#374151', lineHeight: 1.2 }}>
                              {preset.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Pricing Card */}
                <div className="shopify-card">
                  <h3 className="shopify-card-header">
                    Pricing
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label className="shopify-label">
                        Price (PKR) <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6D7175', fontSize: '0.82rem', fontWeight: 600 }}>
                          Rs.
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="2500"
                          className="shopify-input"
                          style={{ paddingLeft: '2.4rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="shopify-label">
                        Compare-at price (PKR)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6D7175', fontSize: '0.82rem', fontWeight: 600 }}>
                          Rs.
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.compare_at_price}
                          onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                          placeholder="3200"
                          className="shopify-input"
                          style={{ paddingLeft: '2.4rem' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="shopify-label">
                        Cost per item (PKR)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6D7175', fontSize: '0.82rem', fontWeight: 600 }}>
                          Rs.
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.cost_per_item}
                          onChange={(e) => setFormData({ ...formData, cost_per_item: e.target.value })}
                          placeholder="1200"
                          className="shopify-input"
                          style={{ paddingLeft: '2.4rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Real-time Profit & Margin banner */}
                  {marginData && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1rem',
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem'
                      }}
                    >
                      <span style={{ color: '#166534', fontWeight: 600 }}>
                        Estimated Profit: Rs. {marginData.profit.toLocaleString()}
                      </span>
                      <span style={{ backgroundColor: '#22C55E', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
                        {marginData.margin}% Margin
                      </span>
                    </div>
                  )}
                </div>

                {/* 4. Inventory Card */}
                <div className="shopify-card">
                  <h3 className="shopify-card-header">
                    Inventory
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <label className="shopify-label" style={{ margin: 0 }}>
                          SKU (Stock Keeping Unit)
                        </label>
                        <button
                          type="button"
                          onClick={handleGenerateSku}
                          style={{ background: 'none', border: 'none', color: '#008060', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Auto-generate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="AM-EXE-101"
                        className="shopify-input"
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>

                    <div>
                      <label className="shopify-label">
                        Barcode (ISBN, UPC, GTIN)
                      </label>
                      <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                        placeholder="0123456789012"
                        className="shopify-input"
                      />
                    </div>

                    <div>
                      <label className="shopify-label">
                        Quantity available
                      </label>
                      <input
                        type="number"
                        value={formData.stock_quantity}
                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                        placeholder="50"
                        className="shopify-input"
                      />
                    </div>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#374151', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      style={{ width: '16px', height: '16px', accentColor: '#008060' }}
                    />
                    <span>Continue selling when out of stock</span>
                  </label>
                </div>

                {/* 5. Fragrance Pyramid & Specifications Card */}
                <div className="shopify-card">
                  <h3 className="shopify-card-header">
                    Fragrance Notes & Accord Pyramid
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="shopify-label">
                        Top Notes (Initial 15-30 minutes)
                      </label>
                      <input
                        type="text"
                        value={formData.top_notes}
                        onChange={(e) => setFormData({ ...formData, top_notes: e.target.value })}
                        placeholder="e.g. Saffron, Sicilian Bergamot, Pink Peppercorn"
                        className="shopify-input"
                      />
                    </div>

                    <div>
                      <label className="shopify-label">
                        Heart / Middle Notes (2-6 hours)
                      </label>
                      <input
                        type="text"
                        value={formData.heart_notes}
                        onChange={(e) => setFormData({ ...formData, heart_notes: e.target.value })}
                        placeholder="e.g. Assamese Agarwood, Damask Rose, Nutmeg"
                        className="shopify-input"
                      />
                    </div>

                    <div>
                      <label className="shopify-label">
                        Base Notes (Dry down 8-14+ hours)
                      </label>
                      <input
                        type="text"
                        value={formData.base_notes}
                        onChange={(e) => setFormData({ ...formData, base_notes: e.target.value })}
                        placeholder="e.g. Roasted Tonka, Ambergris, Dark Musk"
                        className="shopify-input"
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label className="shopify-label">Longevity</label>
                        <select
                          value={formData.longevity}
                          onChange={(e) => setFormData({ ...formData, longevity: e.target.value })}
                          className="shopify-input"
                        >
                          <option value="14+ Hours">14+ Hours (Beast Mode)</option>
                          <option value="10-12 Hours">10-12 Hours (Extrait)</option>
                          <option value="8+ Hours">8+ Hours (All Day)</option>
                          <option value="6-8 Hours">6-8 Hours (Moderate)</option>
                        </select>
                      </div>

                      <div>
                        <label className="shopify-label">Sillage / Projection</label>
                        <select
                          value={formData.sillage}
                          onChange={(e) => setFormData({ ...formData, sillage: e.target.value })}
                          className="shopify-input"
                        >
                          <option value="Strong / Enveloping">Strong / Enveloping</option>
                          <option value="Moderate (Arms length)">Moderate (Arm's length)</option>
                          <option value="Intimate (Skin scent)">Intimate (Skin scent)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ========================================================= */}
              {/* SIDEBAR COLUMN (RIGHT) */}
              {/* ========================================================= */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* 1. Status Card */}
                <div className="shopify-card">
                  <h3 className="shopify-card-header">
                    Status
                  </h3>

                  <div style={{ marginBottom: '1rem' }}>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="shopify-input"
                      style={{ fontWeight: 600 }}
                    >
                      <option value="active">Active (Visible on store)</option>
                      <option value="draft">Draft (Hidden from store)</option>
                    </select>
                    <p style={{ fontSize: '0.75rem', color: '#6D7175', margin: '0.5rem 0 0' }}>
                      Active fragrances will be published immediately to the online store.
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', fontWeight: 600, color: '#111827', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#008060' }}
                      />
                      <span>Feature on Homepage Best Sellers</span>
                    </label>
                  </div>
                </div>

                {/* 2. Product Organization Card */}
                <div className="shopify-card">
                  <h3 className="shopify-card-header">
                    Product Organization
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label className="shopify-label">Category</label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="shopify-input"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="shopify-label">Target Audience</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="shopify-input"
                      >
                        <option value="Unisex">Unisex</option>
                        <option value="Men">Men / Pour Homme</option>
                        <option value="Women">Women / Pour Femme</option>
                      </select>
                    </div>

                    <div>
                      <label className="shopify-label">Volume</label>
                      <input
                        type="text"
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        placeholder="100ml, 50ml, 8ml..."
                        className="shopify-input"
                      />
                    </div>

                    <div>
                      <label className="shopify-label">Concentration</label>
                      <input
                        type="text"
                        value={formData.concentration}
                        onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                        placeholder="Extrait de Parfum (35% Oil)..."
                        className="shopify-input"
                      />
                    </div>

                    <div>
                      <label className="shopify-label">Tags</label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Winter, Oud, Floral, Fall Drop..."
                        className="shopify-input"
                      />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                        {['+ Oud', '+ Winter', '+ Best Seller', '+ Floral', '+ Citrus'].map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const cleanTag = tag.replace('+ ', '');
                              if (!formData.tags.includes(cleanTag)) {
                                setFormData(prev => ({
                                  ...prev,
                                  tags: prev.tags ? `${prev.tags}, ${cleanTag}` : cleanTag
                                }));
                              }
                            }}
                            style={{
                              backgroundColor: '#F1F2F4',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.2rem 0.45rem',
                              fontSize: '0.7rem',
                              color: '#4B5563',
                              cursor: 'pointer'
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Online Store Preview Card */}
                <div className="shopify-card" style={{ backgroundColor: '#FAFAFA' }}>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6D7175', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.75rem' }}>
                    Online Store Preview
                  </h4>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827', margin: '0 0 0.25rem' }}>
                    {formData.name || 'Untitled Fragrance'}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#008060', margin: '0 0 0.4rem', fontWeight: 600 }}>
                    Rs. {Number(formData.price || 0).toLocaleString()}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
                    {formData.volume || '100ml'} · {formData.concentration || 'Extrait de Parfum'}
                  </p>
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
                Discard
              </button>

              <button
                type="submit"
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
                {saving ? 'Saving...' : 'Save product'}
              </button>
            </div>
          </form>

        </div>
      ) : (
        /* ========================================================================= */
        /* 2. CATALOG PRODUCTS LIST VIEW */
        /* ========================================================================= */
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Header Title & Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.35rem', color: '#111827' }}>
                Products
              </h1>
              <p style={{ color: '#6D7175', fontSize: '0.85rem', margin: 0 }}>
                Manage inventory stock, pricing in PKR, olfactory notes, and high-res media.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleClearSampleData}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  padding: '0.55rem 1rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
                title="Remove sample perfumes to enter actual customer products"
              >
                <Sparkles size={14} style={{ color: '#9333EA' }} />
                <span>Clear Samples</span>
              </button>

              <button
                onClick={openCreateEditor}
                style={{
                  backgroundColor: '#008060',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 1px 3px rgba(0,128,96,0.3)'
                }}
              >
                <Plus size={16} />
                <span>Add product</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E1E3E5',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
          >
            <Search size={16} style={{ color: '#6D7175' }} />
            <input
              type="text"
              placeholder="Search products by name, notes, or SKU..."
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

          {/* Shopify Products Table */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E1E3E5',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E1E3E5', backgroundColor: '#F9FAFB', color: '#6D7175', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Product</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Inventory</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#008060', fontWeight: 600 }}>
                        Loading products catalog...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '3.5rem', textAlign: 'center', color: '#6D7175' }}>
                        No products found. Click "Add product" above to create your first item.
                      </td>
                    </tr>
                  ) : (
                    products.map(prod => (
                      <tr
                        key={prod.id}
                        style={{ borderBottom: '1px solid #F1F2F4', transition: 'background-color 0.15s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {/* Product info */}
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div
                              style={{
                                width: '48px',
                                height: '48px',
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
                                alt={prod.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            </div>
                            <div>
                              <p
                                onClick={() => openEditEditor(prod)}
                                style={{ fontWeight: 700, color: '#111827', margin: 0, cursor: 'pointer' }}
                              >
                                {prod.name}
                              </p>
                              <p style={{ fontSize: '0.72rem', color: '#6D7175', margin: '0.15rem 0 0', fontFamily: 'monospace' }}>
                                {prod.sku} · {prod.volume || '100ml'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span
                            style={{
                              backgroundColor: '#E3F1DF',
                              color: '#108043',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}
                          >
                            Active
                          </span>
                        </td>

                        {/* Inventory */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span
                            style={{
                              color: prod.stock_quantity <= 10 ? '#D97706' : '#15803D',
                              fontWeight: 600,
                              fontSize: '0.82rem'
                            }}
                          >
                            {prod.stock_quantity} in stock
                          </span>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '0.85rem 1rem', color: '#4B5563', fontSize: '0.82rem' }}>
                          {prod.category_name || 'Unassigned'}
                        </td>

                        {/* Price */}
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#111827', fontSize: '0.88rem' }}>
                          {formatPKR(prod.price)}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => openEditEditor(prod)}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #D1D5DB',
                                borderRadius: '4px',
                                padding: '0.35rem 0.6rem',
                                color: '#374151',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="Edit in Shopify interface"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(prod.id, prod.name)}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #FCA5A5',
                                borderRadius: '4px',
                                padding: '0.35rem 0.6rem',
                                color: '#DC2626',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="Delete from database"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
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
