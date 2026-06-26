const { Router } = require('express');
const flightController = require('../controllers/flight.controller');

const router = Router();

router.get('/', flightController.getAirports);

module.exports = router;
