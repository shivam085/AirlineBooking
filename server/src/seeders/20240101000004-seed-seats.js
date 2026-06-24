const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch all flights to create seats for them
    const flights = await queryInterface.sequelize.query(
      `SELECT id, totalSeats from flights;`
    );
    const flightRows = flights[0];

    if (flightRows.length === 0) {
      console.warn('No flights found. Skipping seats seeder.');
      return;
    }

    const seats = [];

    flightRows.forEach((flight) => {
      // Assuming 180 seats: 30 rows, 6 seats per row (A, B, C, D, E, F)
      const rows = flight.totalSeats / 6; 
      const columns = ['A', 'B', 'C', 'D', 'E', 'F'];

      for (let row = 1; row <= rows; row++) {
        for (const col of columns) {
          let seatClass = 'economy';
          let priceMultiplier = 1.0;

          // First 3 rows are business class
          if (row <= 3) {
            seatClass = 'business';
            priceMultiplier = 2.5;
          }

          seats.push({
            id: uuidv4(),
            flightId: flight.id,
            seatNumber: `${row}${col}`,
            seatClass,
            priceMultiplier,
            isAvailable: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    });

    if (seats.length > 0) {
      // Sequelize bulkInsert might fail if the array is too large, 
      // but ~540 rows (3 flights * 180 seats) is totally fine for MySQL.
      await queryInterface.bulkInsert('seats', seats, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('seats', null, {});
  },
};
