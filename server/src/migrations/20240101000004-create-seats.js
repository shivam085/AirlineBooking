module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('seats', {
      id: {
        type: Sequelize.CHAR(36),
        primaryKey: true,
      },
      flightId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        references: {
          model: 'flights',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      seatNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      seatClass: {
        type: Sequelize.ENUM('economy', 'business', 'first'),
        defaultValue: 'economy',
      },
      priceMultiplier: {
        type: Sequelize.DECIMAL(4, 2),
        defaultValue: 1.0,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    await queryInterface.addIndex('seats', ['flightId', 'seatNumber'], {
      unique: true,
      name: 'seats_flightId_seatNumber_unique',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('seats');
  },
};
