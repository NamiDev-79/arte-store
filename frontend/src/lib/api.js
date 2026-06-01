const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = {
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/api/products${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Error al cargar productos');
    return res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${API_URL}/api/products/${id}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    return res.json();
  },

  async createProduct(data) {
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Error al crear producto');
    return json;
  },

  async updateProduct(id, data) {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Error al actualizar producto');
    return json;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Error al eliminar producto');
    return json;
  },

  async getCategories() {
    const res = await fetch(`${API_URL}/api/products/categories`);
    if (!res.ok) throw new Error('Error al cargar categorías');
    return res.json();
  },
};
