'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/product/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <article style={{
        border: '1px solid var(--border)',
        borderRadius: 4,
        overflow: 'hidden',
        background: 'white',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: '#e8e0d0' }}>
          {!imgError && product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onError={() => setImgError(true)}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem' }}>
              🎨
            </div>
          )}
          {product.category && (
            <span style={{
              position: 'absolute', top: 12, left: 12,
              background: 'rgba(245,240,232,0.92)',
              backdropFilter: 'blur(8px)',
              padding: '3px 10px',
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.1em',
              color: 'var(--charcoal)',
              borderRadius: 2,
            }}>
              {product.category.toUpperCase()}
            </span>
          )}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(26,18,8,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--cream)',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              letterSpacing: '0.15em',
            }}>
              AGOTADO
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '16px 18px 18px' }}>
          {product.artist && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--warm-gray)', letterSpacing: '0.08em', marginBottom: 6 }}>
              {product.artist.toUpperCase()}
            </p>
          )}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 400, marginBottom: 8, lineHeight: 1.3 }}>
            {product.name}
          </h3>
          {product.description && (
            <p style={{ fontSize: '0.85rem', color: 'var(--warm-gray)', marginBottom: 14, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.description}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--ochre)' }}>
              S/ {Number(product.price).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: product.stock > 0 ? 'var(--warm-gray)' : '#c0392b' }}>
              {product.stock > 0 ? `${product.stock} disp.` : 'Agotado'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
