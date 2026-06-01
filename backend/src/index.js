require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/database');
const productRoutes = require('./routes/products');
const { requestLogger, errorHandler, notFound } = require('./middleware');

const app = express();
const PORT = process.env.PORT || 4000;

/* ── CORS ── */
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    /\.railway\.app$/,
    /\.up\.railway\.app$/,
    /localhost/,
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

/* ── Body parsers ── */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Logging ── */
app.use(requestLogger);

/* ── Health check ── */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'arte-store-api' });
});

/* ── API Routes ── */
app.use('/api/products', productRoutes);

/* ── 404 & Error handlers ── */
app.use(notFound);
app.use(errorHandler);

/* ── Start server after DB init ── */
const start = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`🎨  Arte Store API running on port ${PORT}`);
      console.log(`📡  Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('💥  Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
