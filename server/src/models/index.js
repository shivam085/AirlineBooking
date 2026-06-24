const Sequelize = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import all models manually to control order and ensure they are all loaded
db.User = require('./User')(sequelize);
db.Airport = require('./Airport')(sequelize);
db.Flight = require('./Flight')(sequelize);
db.Seat = require('./Seat')(sequelize);
db.Booking = require('./Booking')(sequelize);
db.Passenger = require('./Passenger')(sequelize);
db.Payment = require('./Payment')(sequelize);

// Define all relationships exactly as specified

db.User.hasMany(db.Booking);
db.Booking.belongsTo(db.User);

db.Airport.hasMany(db.Flight, {
    foreignKey: 'departureAirportId'
});

db.Airport.hasMany(db.Flight, {
    foreignKey: 'arrivalAirportId'
});

db.Flight.belongsTo(db.Airport, {
    as: 'departureAirport'
});

db.Flight.belongsTo(db.Airport, {
    as: 'arrivalAirport'
});

db.Flight.hasMany(db.Seat);
db.Seat.belongsTo(db.Flight);

db.Flight.hasMany(db.Booking);
db.Booking.belongsTo(db.Flight);

db.Booking.hasMany(db.Passenger);
db.Passenger.belongsTo(db.Booking);

db.Seat.hasOne(db.Passenger);
db.Passenger.belongsTo(db.Seat);

db.Booking.hasOne(db.Payment);
db.Payment.belongsTo(db.Booking);

module.exports = db;
