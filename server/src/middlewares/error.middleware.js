const config = require('../config');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    statusCode,
    message,
    // Only show stack trace in development — never leak it in production
    ...(config.env === 'development' && { stack: err.stack }),
  };

  console.error(`[ERROR] ${statusCode} - ${message}`);

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
