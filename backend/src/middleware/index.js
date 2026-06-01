const morgan = require('morgan');

/* ── Logging middleware (Morgan extended format) ── */
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms', {
  skip: (req) => req.url === '/health',
});

/* ── Validation middleware factory ── */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, message: 'Datos inválidos', errors: details });
  }
  req.body = value; // use sanitized value
  next();
};

/* ── Global error handler ── */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${req.method} ${req.url} →`, err.message);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'El recurso ya existe' });
  }
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(500).json({ success: false, message: 'Error de base de datos: tabla no encontrada' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/* ── 404 handler ── */
const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Ruta no encontrada: ${req.method} ${req.url}` });
};

module.exports = { requestLogger, validate, errorHandler, notFound };
