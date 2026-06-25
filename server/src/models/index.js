const Sequelize = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load the 4 simplified models
db.User = require('./User')(sequelize);
db.Airport = require('./Airport')(sequelize);
db.Flight = require('./Flight')(sequelize);
db.Booking = require('./Booking')(sequelize);

// User -> Booking
db.User.hasMany(db.Booking, { foreignKey: 'userId' });
db.Booking.belongsTo(db.User, { foreignKey: 'userId' });

// Airport -> Flight (Departure & Arrival)
db.Airport.hasMany(db.Flight, { foreignKey: 'departureAirportId', as: 'departingFlights' });
db.Airport.hasMany(db.Flight, { foreignKey: 'arrivalAirportId', as: 'arrivingFlights' });

db.Flight.belongsTo(db.Airport, { foreignKey: 'departureAirportId', as: 'departureAirport' });
db.Flight.belongsTo(db.Airport, { foreignKey: 'arrivalAirportId', as: 'arrivalAirport' });

// Flight -> Booking
db.Flight.hasMany(db.Booking, { foreignKey: 'flightId' });
db.Booking.belongsTo(db.Flight, { foreignKey: 'flightId' });

module.exports = db;
