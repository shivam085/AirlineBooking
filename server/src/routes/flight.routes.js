const { Router } = require('express');
const flightController = require('../controllers/flight.controller');

const router = Router();

router.get('/search', flightController.searchFlights);
router.get('/:id', flightController.getFlight);

module.exports = router;
