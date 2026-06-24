const app = require('./src/app');
const config = require('./src/config');

const startServer = () => {
  app.listen(config.port, () => {
    console.log(`\n🚀 Server running in ${config.env} mode on port ${config.port}`);
    console.log(`📡 Health check: http://localhost:${config.port}/api/v1/health\n`);
  });
};

startServer();
