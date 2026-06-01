const fetch = require('node-fetch');
const { pool } = require('../config/database');

/* -- Helper: fetch image URL from Lorem Picsum -- */
const fetchArtImageUrl = async (productName) => {
  try {
    const seed = encodeURIComponent(productName.replace(/\s+/g, '-').toLowerCase());
    const url = `https://picsum.photos/seed/${seed}/600/400`;
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', timeout: 5000 });
    return res.ok ? url : `https://picsum.photos/600/400`;
  } catch {
    return `https://picsum.photos/600/400?random=${Date.now()}`;
  }
};

/* -- GET /api/products -- */
const getAllProducts = async (req, res, next) => {
  try {
    const { category, artist, search } = req.query;
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    let where = [];
    let params = [];

    if (category) { where.push('category = ?');                    params.push(category); }
    if (artist)   { where.push('artist LIKE ?');                   params.push(`%${artist}%`); }
    if (search)   { where.push('(name LIKE ? OR description LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM products ${whereClause}`, params
    );
    const total = countRows[0].total;

    const [rows] = await pool.execute(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/* -- GET /api/products/:id -- */
const getProductById = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

/* -- POST /api/products -- */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, artist } = req.body;

    const image_url = await fetchArtImageUrl(name);

    const [result] = await pool.execute(
      `INSERT INTO products (name, description, price, stock, image_url, category, artist)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description || null, price, stock, image_url, category || null, artist || null]
    );

    const [newProduct] = await pool.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: newProduct[0],
    });
  } catch (err) {
    next(err);
  }
};

/* -- PUT /api/products/:id -- */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    const fields = Object.keys(req.body);
    const values = Object.values(req.body);
    const setClause = fields.map((f) => `${f} = ?`).join(', ');
    await pool.execute(`UPDATE products SET ${setClause} WHERE id = ?`, [...values, id]);

    const [updated] = await pool.execute('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Producto actualizado', data: updated[0] });
  } catch (err) {
    next(err);
  }
};

/* -- DELETE /api/products/:id -- */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.execute('SELECT id FROM products WHERE id = ?', [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (err) {
    next(err);
  }
};

/* -- GET /api/products/categories -- */
const getCategories = async (_req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category'
    );
    res.json({ success: true, data: rows.map((r) => r.category) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories };
