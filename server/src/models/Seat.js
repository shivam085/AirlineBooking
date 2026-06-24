const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Seat extends Model {
    static associate(models) {
      // defined in index.js
    }
  }

  Seat.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      flightId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      seatNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      seatClass: {
        type: DataTypes.ENUM('economy', 'business', 'first'),
        defaultValue: 'economy',
      },
      priceMultiplier: {
        type: DataTypes.DECIMAL(4, 2),
        defaultValue: 1.0,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Seat',
      tableName: 'seats',
      indexes: [
        {
          unique: true,
          fields: ['flightId', 'seatNumber'],
        },
      ],
    }
  );

  return Seat;
};
