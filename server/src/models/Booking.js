const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Booking extends Model {
    static associate(models) {
      // defined in index.js
    }
  }

  Booking.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      flightId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      passengers: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
      seatNumbers: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      paymentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'successful', 'failed'),
        defaultValue: 'pending',
      },
      bookingStatus: {
        type: DataTypes.ENUM('confirmed', 'cancelled'),
        defaultValue: 'confirmed',
      }
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'bookings',
    }
  );

  return Booking;
};
