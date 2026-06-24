module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('flights', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
      },
      airline: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      departureAirportId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'airports',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      arrivalAirportId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'airports',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      flightNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      departureTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      arrivalTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      totalSeats: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      availableSeats: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      basePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'boarding', 'departed', 'arrived', 'cancelled'),
        defaultValue: 'scheduled',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('flights');
  },
};
