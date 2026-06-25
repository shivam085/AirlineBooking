const { Sequelize } = require('sequelize');
const config = require('./src/config/database')[process.env.NODE_ENV || 'development'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

async function dropAll() {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
  await sequelize.query('DROP TABLE IF EXISTS seats;');
  await sequelize.query('DROP TABLE IF EXISTS passengers;');
  await sequelize.query('DROP TABLE IF EXISTS payments;');
  await sequelize.query('DROP TABLE IF EXISTS bookings;');
  await sequelize.query('DROP TABLE IF EXISTS flights;');
  await sequelize.query('DROP TABLE IF EXISTS airports;');
  await sequelize.query('DROP TABLE IF EXISTS users;');
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('All tables dropped');
  process.exit();
}
dropAll();
