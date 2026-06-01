'use client';
import { useState, useCallback } from 'react';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSearch(value.trim());
  }, [value, onSearch]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 0, flex: '1 1 280px', maxWidth: 400 }}>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Buscar obras, artistas..."
        style={{
          flex: 1,
          padding: '8px 14px',
          border: '1px solid var(--border)',
          borderRight: 'none',
          borderRadius: '2px 0 0 2px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          background: 'white',
          color: 'var(--ink)',
          outline: 'none',
        }}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            padding: '8px 10px',
            border: '1px solid var(--border)',
            borderRight: 'none',
            background: 'white',
            color: 'var(--warm-gray)',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      )}
      <button
        type="submit"
        style={{
          padding: '8px 16px',
          background: 'var(--ink)',
          color: 'var(--cream)',
          border: '1px solid var(--ink)',
          borderRadius: '0 2px 2px 0',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.06em',
          cursor: 'pointer',
        }}
      >
        BUSCAR
      </button>
    </form>
  );
}
