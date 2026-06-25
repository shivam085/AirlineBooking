const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Flight extends Model {
    static associate(models) {
      // defined in index.js
    }
  }

  Flight.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      airline: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      flightNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      departureAirportId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      arrivalAirportId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      departureTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      basePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: 'Flight',
      tableName: 'flights',
    }
  );

  return Flight;
};
