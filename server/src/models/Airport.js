const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Airport extends Model {
    static associate(models) {
      // defined in index.js
    }
  }

  Airport.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Airport',
      tableName: 'airports',
    }
  );

  return Airport;
};
