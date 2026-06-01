'use client';
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', page: 1 });
  const [pagination, setPagination] = useState({});

  const fetchProducts = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== undefined));
      const res = await api.getProducts(clean);
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  useEffect(() => {
    api.getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const handleSearch = (search) => setFilters(f => ({ ...f, search, page: 1 }));
  const handleCategory = (category) => setFilters(f => ({ ...f, category, page: 1 }));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', color: 'var(--warm-gray)', marginBottom: 16 }}>
          GALERÍA · EDICIÓN LIMITADA
        </p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
          Arte que<br /><em style={{ color: 'var(--ochre)' }}>transforma espacios</em>
        </h1>
        <p style={{ color: 'var(--warm-gray)', maxWidth: 520, margin: '0 auto', fontSize: '1.05rem' }}>
          Cada pieza es una historia. Descubre obras únicas de artistas emergentes y consagrados.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar onSearch={handleSearch} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => handleCategory('')} style={filterBtn(filters.category === '')}>Todas</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => handleCategory(cat)} style={filterBtn(filters.category === cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--warm-gray)' }}>
          <p style={{ fontSize: '3rem', marginBottom: 16 }}>⚠</p>
          <p>{error}</p>
          <p style={{ fontSize: 13, marginTop: 8, fontFamily: 'var(--font-mono)' }}>Verifica que el backend esté en línea</p>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--warm-gray)' }}>
          <p style={{ fontSize: '3rem', marginBottom: 16 }}>🎨</p>
          <p>No se encontraron productos</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                  style={{
                    ...filterBtn(filters.page === i + 1),
                    width: 36, height: 36, padding: 0,
                    fontFamily: 'var(--font-mono)', fontSize: 13,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
          <p style={{ textAlign: 'center', marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--warm-gray)' }}>
            {pagination.total} obra{pagination.total !== 1 ? 's' : ''} en la colección
          </p>
        </>
      )}
    </div>
  );
}

const filterBtn = (active) => ({
  padding: '6px 16px',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  letterSpacing: '0.06em',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  background: active ? 'var(--ink)' : 'transparent',
  color: active ? 'var(--cream)' : 'var(--charcoal)',
  cursor: 'pointer',
  transition: 'all 0.2s',
  whiteSpace: 'nowrap',
});

const SkeletonCard = () => (
  <div style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
    <div style={{ background: '#e8e0d0', height: 220, animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ padding: 20 }}>
      <div style={{ background: '#e8e0d0', height: 20, borderRadius: 2, marginBottom: 10, width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ background: '#e8e0d0', height: 14, borderRadius: 2, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ background: '#e8e0d0', height: 14, borderRadius: 2, width: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  </div>
);
