const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const airports = [
      {
        id: uuidv4(),
        name: 'Chhatrapati Shivaji Maharaj International Airport',
        city: 'Mumbai',
        country: 'India',
        code: 'BOM',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Indira Gandhi International Airport',
        city: 'Delhi',
        country: 'India',
        code: 'DEL',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Kempegowda International Airport',
        city: 'Bangalore',
        country: 'India',
        code: 'BLR',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Rajiv Gandhi International Airport',
        city: 'Hyderabad',
        country: 'India',
        code: 'HYD',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Chennai International Airport',
        city: 'Chennai',
        country: 'India',
        code: 'MAA',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Goa International Airport',
        city: 'Goa',
        country: 'India',
        code: 'GOI',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('airports', airports, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('airports', null, {});
  },
};
