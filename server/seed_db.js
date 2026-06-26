const db = require('./src/models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    // 1. Force sync the database (Warning: drops all data)
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
    await db.sequelize.sync({ force: true });
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });
    console.log('✅ Database synced');

    // 2. Create Default Admin User
    const adminPassword = await bcrypt.hash('Admin123!', 12);
    await db.User.create({
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@skybook.com',
      password: adminPassword,
      role: 'admin',
      isVerified: true
    });
    console.log('✅ Admin user created (admin@skybook.com / Admin123!)');

    // 3. Create Airports
    const airports = await db.Airport.bulkCreate([
      { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India' },
      { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
      { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India' },
      { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India' },
      { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India' }
    ]);
    console.log(`✅ ${airports.length} Airports created`);

    // 4. Create Flights
    // We'll create flights starting from "today" for the next 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const flightsData = [];
    const airlines = ['SkyJet', 'AeroIndia', 'CloudConnect'];

    // Generate flights for the next 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const flightDate = new Date(today);
      flightDate.setDate(flightDate.getDate() + dayOffset);

      // DEL -> BOM (Morning)
      flightsData.push({
        airline: airlines[0],
        flightNumber: `SJ-${100 + dayOffset}`,
        departureAirportId: airports.find(a => a.code === 'DEL').id,
        arrivalAirportId: airports.find(a => a.code === 'BOM').id,
        departureTime: new Date(flightDate.setHours(8, 0, 0, 0)),
        arrivalTime: new Date(flightDate.setHours(10, 15, 0, 0)),
        basePrice: 3500 + Math.floor(Math.random() * 1000),
        totalSeats: 60
      });

      // BOM -> DEL (Evening)
      flightsData.push({
        airline: airlines[1],
        flightNumber: `AI-${200 + dayOffset}`,
        departureAirportId: airports.find(a => a.code === 'BOM').id,
        arrivalAirportId: airports.find(a => a.code === 'DEL').id,
        departureTime: new Date(flightDate.setHours(18, 30, 0, 0)),
        arrivalTime: new Date(flightDate.setHours(20, 45, 0, 0)),
        basePrice: 4200 + Math.floor(Math.random() * 1000),
        totalSeats: 120
      });

      // BLR -> DEL (Afternoon)
      flightsData.push({
        airline: airlines[2],
        flightNumber: `CC-${300 + dayOffset}`,
        departureAirportId: airports.find(a => a.code === 'BLR').id,
        arrivalAirportId: airports.find(a => a.code === 'DEL').id,
        departureTime: new Date(flightDate.setHours(14, 0, 0, 0)),
        arrivalTime: new Date(flightDate.setHours(16, 45, 0, 0)),
        basePrice: 5100 + Math.floor(Math.random() * 1000),
        totalSeats: 180
      });
      
      // DEL -> BLR (Morning)
      flightsData.push({
        airline: airlines[0],
        flightNumber: `SJ-${400 + dayOffset}`,
        departureAirportId: airports.find(a => a.code === 'DEL').id,
        arrivalAirportId: airports.find(a => a.code === 'BLR').id,
        departureTime: new Date(flightDate.setHours(9, 30, 0, 0)),
        arrivalTime: new Date(flightDate.setHours(12, 10, 0, 0)),
        basePrice: 4800 + Math.floor(Math.random() * 1000),
        totalSeats: 60
      });
    }

    const flights = await db.Flight.bulkCreate(flightsData);
    console.log(`✅ ${flights.length} Flights created`);

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
