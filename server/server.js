const app = require('./src/app');
const config = require('./src/config');
const db = require('./src/models');
const http = require('http');
const { Server } = require('socket.io');

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully');

    const server = http.createServer(app);
    
    // Setup Socket.io
    const io = new Server(server, {
      cors: {
        origin: config.clientUrl,
        credentials: true
      }
    });

    // Attach our custom Seat Locking handler
    const setupSockets = require('./src/sockets/seatHandler');
    setupSockets(io);

    // Make io accessible to the rest of the application
    app.set('io', io);

    server.listen(config.port, () => {
      console.log(`\n🚀 Server running in ${config.env} mode on port ${config.port}`);
      console.log(`📡 Health check: http://localhost:${config.port}/api/v1/health\n`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
