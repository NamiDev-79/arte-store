'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../../lib/api';

const CATEGORIES = ['Pintura', 'Escultura', 'Fotografía', 'Acuarela', 'Cerámica', 'Grabado', 'Ilustración', 'Arte Digital', 'Textil', 'Otro'];

const emptyForm = { name: '', description: '', price: '', stock: '', category: '', artist: '' };

function AdminContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ limit: 100 });
      setProducts(res.data);
    } catch (e) {
      showMsg('error', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (editId) {
      const product = products.find(p => p.id == editId);
      if (product) startEdit(product);
    }
  }, [editId, products]);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || '',
      artist: product.artist || '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        ...(formData.category && { category: formData.category }),
        ...(formData.artist && { artist: formData.artist }),
      };

      if (editingId) {
        await api.updateProduct(editingId, payload);
        showMsg('success', '✓ Producto actualizado correctamente');
      } else {
        await api.createProduct(payload);
        showMsg('success', '✓ Producto creado — imagen obtenida de Lorem Picsum');
      }
      cancelEdit();
      fetchProducts();
    } catch (err) {
      showMsg('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteProduct(id);
      showMsg('success', '✓ Producto eliminado');
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      showMsg('error', err.message);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--warm-gray)', letterSpacing: '0.15em', marginBottom: 8 }}>ADMINISTRACIÓN</p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, letterSpacing: '-0.02em' }}>Panel de Gestión</h1>
        </div>
        <button onClick={() => { cancelEdit(); setShowForm(s => !s); }}
          style={{ padding: '10px 20px', background: 'var(--ink)', color: 'var(--cream)', border: 'none', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer' }}>
          {showForm ? 'CANCELAR' : '+ NUEVO PRODUCTO'}
        </button>
      </div>

      {/* Feedback message */}
      {message && (
        <div style={{ padding: '12px 18px', marginBottom: 24, borderRadius: 2, borderLeft: '3px solid', borderColor: message.type === 'success' ? 'var(--ochre)' : '#c0392b', background: message.type === 'success' ? '#fdf8f0' : '#fdf0f0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          {message.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 4, padding: 32, marginBottom: 40, background: 'white' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 300, marginBottom: 24 }}>
            {editingId ? `Editar: ${formData.name}` : 'Registrar Nueva Obra'}
          </h2>
          {!editingId && (
            <div style={{ padding: '10px 16px', background: '#fdf8f0', border: '1px solid #e4d5b0', borderRadius: 2, marginBottom: 24, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--warm-gray)' }}>
              💡 Al crear, la imagen se obtendrá automáticamente desde <strong>Lorem Picsum API</strong>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <Field label="NOMBRE DE LA OBRA *" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej: Óleo sobre lienzo – Amanecer" />
              <Field label="ARTISTA" name="artist" value={formData.artist} onChange={handleChange} placeholder="Nombre del artista" />
              <Field label="PRECIO (S/) *" name="price" value={formData.price} onChange={handleChange} required type="number" min="0" step="0.01" placeholder="0.00" />
              <Field label="STOCK *" name="stock" value={formData.stock} onChange={handleChange} required type="number" min="0" placeholder="0" />
              <div>
                <label style={labelStyle}>CATEGORÍA</label>
                <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                  <option value="">— Sin categoría —</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>DESCRIPCIÓN</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4}
                placeholder="Describe la obra, técnica, materiales, dimensiones..."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            </div>
            {editingId && (
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>URL DE IMAGEN (opcional)</label>
                <input name="image_url" value={formData.image_url || ''} onChange={handleChange}
                  placeholder="https://..." style={inputStyle} />
              </div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" disabled={submitting}
                style={{ padding: '12px 28px', background: submitting ? '#ccc' : 'var(--ink)', color: 'var(--cream)', border: 'none', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'GUARDANDO...' : (editingId ? 'ACTUALIZAR' : 'CREAR PRODUCTO')}
              </button>
              <button type="button" onClick={cancelEdit}
                style={{ padding: '12px 20px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--charcoal)', borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', cursor: 'pointer' }}>
                CANCELAR
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products table */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', background: 'white' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 400 }}>Inventario de Obras</h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--warm-gray)' }}>{products.length} producto{products.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--warm-gray)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>CARGANDO...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--warm-gray)' }}>
            <p style={{ fontSize: '2rem', marginBottom: 12 }}>🎨</p>
            <p>Sin productos aún. Crea el primero.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#faf7f2' }}>
                  {['ID', 'Imagen', 'Nombre', 'Categoría', 'Precio', 'Stock', 'Acciones'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--warm-gray)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'white' : '#fdfcfb' }}>
                    <td style={tdStyle}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--warm-gray)' }}>#{p.id}</span></td>
                    <td style={tdStyle}>
                      <div style={{ width: 52, height: 40, borderRadius: 2, overflow: 'hidden', background: '#e8e0d0' }}>
                        {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <p style={{ fontWeight: 400, marginBottom: 2, maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                      {p.artist && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--warm-gray)' }}>{p.artist}</p>}
                    </td>
                    <td style={tdStyle}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{p.category || '—'}</span></td>
                    <td style={tdStyle}><span style={{ color: 'var(--ochre)', fontWeight: 600 }}>S/ {Number(p.price).toFixed(2)}</span></td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: p.stock > 0 ? 'inherit' : '#c0392b' }}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => startEdit(p)} style={actionBtn('#1a1208', '#f5f0e8')}>EDITAR</button>
                        {deleteConfirm === p.id ? (
                          <>
                            <button onClick={() => handleDelete(p.id)} style={actionBtn('#c0392b', 'white')}>¿CONFIRMAR?</button>
                            <button onClick={() => setDeleteConfirm(null)} style={actionBtn('#888', 'white')}>NO</button>
                          </>
                        ) : (
                          <button onClick={() => setDeleteConfirm(p.id)} style={actionBtn('transparent', '#c0392b', '#c0392b')}>ELIMINAR</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ padding: 60, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--warm-gray)' }}>CARGANDO PANEL...</div>}>
      <AdminContent />
    </Suspense>
  );
}

const labelStyle = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--warm-gray)', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 2, fontFamily: 'var(--font-display)', fontSize: '0.95rem', color: 'var(--ink)', background: 'white', outline: 'none' };
const tdStyle = { padding: '11px 14px', verticalAlign: 'middle' };
const actionBtn = (bg, color, border) => ({
  padding: '5px 10px', background: bg, color, border: `1px solid ${border || bg}`,
  borderRadius: 2, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em',
  cursor: 'pointer', whiteSpace: 'nowrap',
});

const Field = ({ label, name, value, onChange, required, type = 'text', ...rest }) => (
  <div>
    <label style={labelStyle}>{label}</label>
    <input name={name} value={value} onChange={onChange} required={required} type={type} style={inputStyle} {...rest} />
  </div>
);
