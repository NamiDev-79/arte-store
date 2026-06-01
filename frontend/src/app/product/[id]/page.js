'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getProduct(params.id)
      .then(r => setProduct(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div style={{ maxWidth: 900, margin: '4rem auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
      <div style={{ background: '#e8e0d0', height: 480, borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ paddingTop: 20 }}>
        {[100, 60, 80, 40, 90].map((w, i) => (
          <div key={i} style={{ background: '#e8e0d0', height: i === 0 ? 36 : 16, borderRadius: 2, marginBottom: 16, width: `${w}%`, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
    </div>
  );

  if (error || !product) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <p style={{ fontSize: '4rem', marginBottom: 16 }}>⚠</p>
      <p style={{ color: 'var(--warm-gray)' }}>{error || 'Producto no encontrado'}</p>
      <Link href="/" style={{ display: 'inline-block', marginTop: 24, padding: '10px 24px', background: 'var(--ink)', color: 'var(--cream)', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 12 }}>
        ← VOLVER A LA GALERÍA
      </Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 2rem' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--warm-gray)', letterSpacing: '0.08em', marginBottom: 40 }}>
        ← VOLVER A LA GALERÍA
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
        {/* Image */}
        <div style={{ position: 'relative' }}>
          <div style={{ borderRadius: 4, overflow: 'hidden', background: '#e8e0d0', aspectRatio: '4/3' }}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '5rem' }}>🎨</div>
            )}
          </div>
          {product.category && (
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <span style={{ padding: '4px 12px', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--warm-gray)', letterSpacing: '0.08em', borderRadius: 2 }}>
                {product.category}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {product.artist && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ochre)', letterSpacing: '0.15em', marginBottom: 12 }}>
              {product.artist.toUpperCase()}
            </p>
          )}
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: 24, letterSpacing: '-0.01em' }}>
            {product.name}
          </h1>
          <div style={{ width: 40, height: 1, background: 'var(--ochre)', marginBottom: 24 }} />
          {product.description && (
            <p style={{ color: 'var(--charcoal)', lineHeight: 1.75, marginBottom: 32, fontSize: '0.95rem' }}>
              {product.description}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
            <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--ochre)' }}>
              S/ {Number(product.price).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
            <Stat label="DISPONIBILIDAD" value={product.stock > 0 ? `${product.stock} en stock` : 'Agotado'} />
            {product.category && <Stat label="CATEGORÍA" value={product.category} />}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              style={{
                flex: 1, padding: '14px 24px',
                background: product.stock > 0 ? 'var(--ink)' : '#ccc',
                color: 'var(--cream)',
                border: 'none', borderRadius: 2,
                fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em',
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
              }}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'ADQUIRIR OBRA' : 'AGOTADO'}
            </button>
            <Link
              href={`/admin?edit=${product.id}`}
              style={{
                padding: '14px 20px',
                border: '1px solid var(--border)',
                borderRadius: 2,
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--charcoal)',
                letterSpacing: '0.06em',
                display: 'inline-flex', alignItems: 'center',
              }}
            >
              EDITAR
            </Link>
          </div>
          <p style={{ marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--warm-gray)', letterSpacing: '0.06em' }}>
            ID #{product.id} · Registrado {new Date(product.created_at).toLocaleDateString('es-PE')}
          </p>
        </div>
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div style={{ padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 2 }}>
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--warm-gray)', letterSpacing: '0.12em', marginBottom: 4 }}>{label}</p>
    <p style={{ fontSize: '0.95rem', fontWeight: 400 }}>{value}</p>
  </div>
);
