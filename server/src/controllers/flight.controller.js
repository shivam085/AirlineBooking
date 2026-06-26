const { Flight, Airport } = require('../models');
const { Op } = require('sequelize');

class FlightController {
  // Get all airports (for dropdowns)
  async getAirports(req, res, next) {
    try {
      const airports = await Airport.findAll({
        order: [['city', 'ASC']]
      });
      res.status(200).json({ success: true, data: airports });
    } catch (error) {
      next(error);
    }
  }

  // Search flights
  async searchFlights(req, res, next) {
    try {
      const { from, to, date, passengers } = req.query;

      // Build query
      const whereClause = {};

      if (from) whereClause.departureAirportId = from;
      if (to) whereClause.arrivalAirportId = to;
      
      // If date is provided, find flights on that specific day
      if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        whereClause.departureTime = {
          [Op.between]: [startDate, endDate]
        };
      }

      // We should only return flights that have enough seats for the requested passengers
      // Since bookedSeats is dynamically calculated in bookings, for this simple Phase 4
      // we'll just check totalSeats > passengers. In Phase 5 we'll do real capacity checking.
      if (passengers) {
        whereClause.totalSeats = {
          [Op.gte]: parseInt(passengers)
        };
      }

      const flights = await Flight.findAll({
        where: whereClause,
        include: [
          { model: Airport, as: 'departureAirport' },
          { model: Airport, as: 'arrivalAirport' }
        ],
        order: [['departureTime', 'ASC']]
      });

      res.status(200).json({ success: true, data: flights });
    } catch (error) {
      next(error);
    }
  }

  // Get single flight details
  async getFlight(req, res, next) {
    try {
      const { id } = req.params;
      const flight = await Flight.findByPk(id, {
        include: [
          { model: Airport, as: 'departureAirport' },
          { model: Airport, as: 'arrivalAirport' }
        ]
      });

      if (!flight) {
        return res.status(404).json({ success: false, message: 'Flight not found' });
      }

      res.status(200).json({ success: true, data: flight });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FlightController();
