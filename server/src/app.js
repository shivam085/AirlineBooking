const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('./config');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const ApiError = require('./utils/ApiError');

const app = express();

// --------------- Security Middleware ---------------
// Sets various HTTP headers to help protect the app
app.use(helmet());

// Enable CORS for the frontend origin, with credentials (cookies)
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));

// --------------- Body Parsers ---------------
// Parse incoming JSON payloads (max 10mb for image uploads later)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// --------------- Logging ---------------
// Log HTTP requests in development mode only
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// --------------- API Routes ---------------
// All routes are prefixed with /api/v1
app.use('/api/v1', routes);

// --------------- 404 Handler ---------------
// If no route matched, create a 404 error and pass to error handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

// --------------- Global Error Handler ---------------
// Must be the LAST middleware — catches all errors from above
app.use(errorHandler);

module.exports = app;
