/** Central error handler – must be registered last. Sends real message to client so UI can show it. */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err?.message || err);
  const status = err.statusCode || err.status || 500;
  const message = (err && (err.message || err.msg || err.error)) || String(err) || 'Internal server error';
  res.status(status).json({ message });
}
