const ApiResponse = require('../utils/ApiResponse');

const healthCheck = (req, res) => {
  const response = new ApiResponse(200, 'Server is running healthy 🚀', {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });

  res.status(response.statusCode).json(response);
};

module.exports = { healthCheck };
