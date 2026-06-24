const app = require('./src/app');
const config = require('./src/config');
const db = require('./src/models');

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully');

    app.listen(config.port, () => {
      console.log(`\n🚀 Server running in ${config.env} mode on port ${config.port}`);
      console.log(`📡 Health check: http://localhost:${config.port}/api/v1/health\n`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
