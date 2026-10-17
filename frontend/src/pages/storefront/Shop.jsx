import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, Star, ShoppingBag, LayoutGrid, List, SlidersHorizontal, X, Filter } from 'lucide-react';
import api from '../../api';
import { useCart } from '../../context/CartContext';
import CategorySlider from '../../components/storefront/CategorySlider';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialGender = searchParams.get('gender') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedGender, setSelectedGender] = useState(initialGender);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Mobile filter drawer toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Accordion toggle states
  const [rangeOpen, setRangeOpen] = useState(true);
  const [genderOpen, setGenderOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products', {
            category: selectedCategory,
            search: searchQuery,
            gender: selectedGender,
            sort: sortBy
          }),
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
    fetchCatalog();
  }, [selectedCategory, searchQuery, selectedGender, sortBy]);

  // Update query params when category changes
  const handleCategorySelect = (slug) => {
    if (selectedCategory === slug) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  // Local price filter calculation
  const displayedProducts = products.filter(p => {
    if (!selectedPriceRange) return true;
    if (selectedPriceRange === 'under2000') return p.price < 2000;
    if (selectedPriceRange === '2000to3000') return p.price >= 2000 && p.price <= 3000;
    if (selectedPriceRange === 'above3000') return p.price > 3000;
    return true;
  });

  const getPageTitle = () => {
    if (selectedCategory) {
      const match = categories.find(c => c.slug === selectedCategory);
      if (match) return match.name.toUpperCase();
    }
    if (searchQuery) return `SEARCH: "${searchQuery.toUpperCase()}"`;
    return 'ALL PERFUMES';
  };

  const reviewsData = {
    1: { rating: 5.0, count: 645 },
    2: { rating: 4.9, count: 410 },
    3: { rating: 4.9, count: 262 },
    4: { rating: 4.8, count: 48 },
    5: { rating: 5.0, count: 520 },
    6: { rating: 4.9, count: 380 },
    7: { rating: 4.9, count: 185 },
    8: { rating: 4.9, count: 295 },
    9: { rating: 5.0, count: 890 }
  };

  const formatPKR = (amount) => {
    return `Rs.${Number(amount || 0).toLocaleString()}`;
  };

  // Active filter count
  const activeFiltersCount = [
    Boolean(selectedCategory),
    Boolean(selectedGender),
    Boolean(selectedPriceRange),
    Boolean(searchQuery)
  ].filter(Boolean).length;

  const resetAllFilters = () => {
    setSelectedGender('');
    setSelectedPriceRange('');
    setSearchQuery('');
    searchParams.delete('category');
    searchParams.delete('search');
    searchParams.delete('gender');
    setSearchParams(searchParams);
  };

  // Shared Filters Component (used for both desktop sidebar & mobile slide-out drawer)
  const FilterContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* RANGE Accordion */}
      <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1.25rem' }}>
        <div
          onClick={() => setRangeOpen(!rangeOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: rangeOpen ? '1rem' : 0
          }}
        >
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#111827', margin: 0 }}>
            COLLECTION / RANGE
          </h4>
          {rangeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {rangeOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#374151', cursor: 'pointer' }}>
              <input
                type="radio"
                name="rangeFilter"
                checked={!selectedCategory}
                onChange={() => handleCategorySelect('')}
              />
              <span>All Collections</span>
            </label>

            {categories.map(cat => (
              <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#374151', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="rangeFilter"
                  checked={selectedCategory === cat.slug}
                  onChange={() => handleCategorySelect(cat.slug)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* GENDER Accordion */}
      <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1.25rem' }}>
        <div
          onClick={() => setGenderOpen(!genderOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: genderOpen ? '1rem' : 0
          }}
        >
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#111827', margin: 0 }}>
            GENDER
          </h4>
          {genderOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {genderOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'All Genders', value: '' },
              { label: 'Men', value: 'Men' },
              { label: 'Women', value: 'Women' },
              { label: 'Unisex', value: 'Unisex' }
            ].map(g => (
              <label key={g.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#374151', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="genderFilter"
                  checked={selectedGender === g.value}
                  onChange={() => setSelectedGender(g.value)}
                />
                <span>{g.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* PRICE Accordion */}
      <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '1.25rem' }}>
        <div
          onClick={() => setPriceOpen(!priceOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: priceOpen ? '1rem' : 0
          }}
        >
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#111827', margin: 0 }}>
            PRICE
          </h4>
          {priceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {priceOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: 'All Prices', value: '' },
              { label: 'Under Rs. 2,000', value: 'under2000' },
              { label: 'Rs. 2,000 - Rs. 3,000', value: '2000to3000' },
              { label: 'Above Rs. 3,000', value: 'above3000' }
            ].map(p => (
              <label key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#374151', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="priceFilter"
                  checked={selectedPriceRange === p.value}
                  onChange={() => setSelectedPriceRange(p.value)}
                />
                <span>{p.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Reset Filters Button */}
      {activeFiltersCount > 0 && (
        <button
          onClick={resetAllFilters}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            padding: '0.55rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            color: '#DC2626',
            textAlign: 'center'
          }}
        >
          Reset All Filters ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', paddingBottom: '6rem' }}>
      
      {/* 1. Category Circular/Rounded Pills Slider */}
      <CategorySlider />

      <div className="container" style={{ paddingTop: '1.5rem' }}>
        
        {/* Collection Main Title */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#111827',
              margin: '0 0 0.5rem'
            }}
          >
            {getPageTitle()}
          </h1>
          <div style={{ width: '50px', height: '3px', backgroundColor: '#B3861B' }} />
        </div>

        {/* Mobile Filter Toggle & Quick Info Bar (< 768px) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            border: '1px solid #E5E7EB'
          }}
        >
          <button
            onClick={() => setMobileFilterOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              padding: '0.5rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#111827',
              cursor: 'pointer'
            }}
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span
                style={{
                  backgroundColor: '#B3861B',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  marginLeft: '0.2rem'
                }}
              >
                {activeFiltersCount}
              </span>
            )}
          </button>

          <span style={{ fontSize: '0.82rem', color: '#6B7280', fontWeight: 600 }}>
            {displayedProducts.length} items
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                padding: '0.45rem 0.65rem',
                fontSize: '0.78rem',
                color: '#111827',
                backgroundColor: '#FFFFFF',
                outline: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>

            <div style={{ display: 'flex', gap: '2px', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '2px', backgroundColor: '#FFFFFF' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? '#111827' : 'transparent',
                  color: viewMode === 'grid' ? '#FFFFFF' : '#6B7280',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.3rem 0.4rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Grid View (2-card mobile)"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? '#111827' : 'transparent',
                  color: viewMode === 'list' ? '#FFFFFF' : '#6B7280',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.3rem 0.4rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="List View"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Layout: Desktop Sidebar (Hidden on small screens) + Right Product Grid */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
          
          {/* Desktop Left Sidebar (>= 1024px) */}
          <aside
            style={{
              flex: '0 0 240px',
              borderRight: '1px solid #E5E7EB',
              paddingRight: '1.75rem',
              display: 'none'
            }}
            className="desktop-filter-sidebar"
          >
            <FilterContent />
          </aside>

          {/* Main Product Grid (Responsive: 2 cards on Mobile, 3 on Tablet, 4 on Desktop) */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: '#B3861B' }}>
                <p style={{ fontWeight: 600, letterSpacing: '0.05em' }}>Opening fragrance collection...</p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', border: '1px dashed #D1D5DB', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#111827' }}>No Fragrances Found</h3>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  Try selecting another category or resetting the filters.
                </p>
                <button
                  onClick={resetAllFilters}
                  style={{
                    backgroundColor: '#111827',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={viewMode === 'grid' ? 'ecommerce-product-grid' : ''}
                style={viewMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: '1rem' } : {}}
              >
                {displayedProducts.map(product => {
                  const reviews = reviewsData[product.id] || { rating: 4.9, count: 120 };
                  return (
                    <div
                      key={product.id}
                      className={viewMode === 'grid' ? 'product-card' : ''}
                      style={viewMode === 'list' ? {
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '1.25rem',
                        alignItems: 'center'
                      } : {}}
                    >
                      {/* Bottle Image */}
                      <Link
                        to={`/product/${product.slug || product.id}`}
                        className={viewMode === 'grid' ? 'card-img-container' : ''}
                        style={{
                          position: 'relative',
                          width: viewMode === 'grid' ? '100%' : '140px',
                          height: viewMode === 'list' ? '140px' : undefined,
                          flexShrink: 0,
                          backgroundColor: '#FFFFFF',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          display: 'block',
                          marginBottom: viewMode === 'grid' ? '0.65rem' : 0
                        }}
                      >
                        <img
                          src={product.image_url}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                        />

                        {/* Red SALE Badge */}
                        {product.compare_at_price > product.price && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '6px',
                              left: '6px',
                              backgroundColor: '#DC2626',
                              color: '#FFFFFF',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '3px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em'
                            }}
                          >
                            SALE
                          </span>
                        )}
                      </Link>

                      {/* Info Container */}
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                        <Link
                          to={`/product/${product.slug || product.id}`}
                          className="product-card-title"
                          style={{ textDecoration: 'none' }}
                        >
                          {product.name}
                        </Link>

                        <p className="product-card-subtitle">
                          {product.short_description ? product.short_description.split('.')[0] : `${product.category_name || 'Executive Range'} | ${product.volume || '100ml'}`}
                        </p>

                        {/* Star Rating & Review Count */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', gap: '1px', color: '#F59E0B' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} fill="#F59E0B" />
                            ))}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#6B7280', fontWeight: 500 }}>
                            {reviews.count}
                          </span>
                        </div>

                        {/* Price & Add to Cart Button */}
                        <div className="product-card-footer">
                          <div>
                            <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#DC2626' }}>
                              {formatPKR(product.price)}
                            </span>
                            {product.compare_at_price > product.price && (
                              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textDecoration: 'line-through', marginLeft: '0.35rem' }}>
                                {formatPKR(product.compare_at_price)}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => addToCart(product, 1)}
                            style={{
                              backgroundColor: '#111827',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.4rem 0.7rem',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              transition: 'background-color 0.2s',
                              flexShrink: 0
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C5A059')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#111827')}
                          >
                            <ShoppingBag size={12} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

      </div>

      {/* Mobile Filters Slide-over / Bottom Drawer */}
      {mobileFilterOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex' }}>
          {/* Backdrop */}
          <div
            onClick={() => setMobileFilterOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(3px)'
            }}
          />

          {/* Drawer Panel */}
          <div
            style={{
              position: 'relative',
              width: '85%',
              maxWidth: '360px',
              backgroundColor: '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 25px rgba(0,0,0,0.2)',
              zIndex: 121
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #E5E7EB'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={18} style={{ color: '#B3861B' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#111827' }}>
                  Filter Perfumes
                </h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Filter Options */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              <FilterContent />
            </div>

            {/* Footer Apply Button */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
              <button
                onClick={() => setMobileFilterOpen(false)}
                style={{
                  width: '100%',
                  backgroundColor: '#111827',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.85rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Apply Filters ({displayedProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media query for desktop filter sidebar */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-filter-sidebar {
            display: flex !important;
          }
        }
      `}</style>

    </div>
  );
}
