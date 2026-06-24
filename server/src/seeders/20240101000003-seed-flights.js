const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch airports
    const airports = await queryInterface.sequelize.query(
      `SELECT id, code from airports;`
    );
    const airportRows = airports[0];

    if (airportRows.length === 0) {
      console.warn('Airports not seeded. Skipping flights seeder.');
      return;
    }

    const getAirportId = (code) => airportRows.find((a) => a.code === code)?.id;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const flights = [
      {
        id: uuidv4(),
        airline: 'SkyJet',
        departureAirportId: getAirportId('BOM'),
        arrivalAirportId: getAirportId('DEL'),
        flightNumber: 'SJ-101',
        departureTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
        arrivalTime: new Date(tomorrow.setHours(10, 15, 0, 0)),
        totalSeats: 180,
        availableSeats: 180,
        basePrice: 3499.00,
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        airline: 'SkyJet',
        departureAirportId: getAirportId('DEL'),
        arrivalAirportId: getAirportId('BOM'),
        flightNumber: 'SJ-202',
        departureTime: new Date(tomorrow.setHours(18, 30, 0, 0)),
        arrivalTime: new Date(tomorrow.setHours(20, 45, 0, 0)),
        totalSeats: 180,
        availableSeats: 180,
        basePrice: 4199.00,
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        airline: 'SkyJet',
        departureAirportId: getAirportId('BLR'),
        arrivalAirportId: getAirportId('HYD'),
        flightNumber: 'SJ-303',
        departureTime: new Date(dayAfter.setHours(9, 15, 0, 0)),
        arrivalTime: new Date(dayAfter.setHours(10, 30, 0, 0)),
        totalSeats: 180,
        availableSeats: 180,
        basePrice: 2899.00,
        status: 'scheduled',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const validFlights = flights.filter(f => f.departureAirportId && f.arrivalAirportId);

    if (validFlights.length > 0) {
      await queryInterface.bulkInsert('flights', validFlights, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('flights', null, {});
  },
};
