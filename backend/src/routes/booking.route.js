const router = require('express').Router(); const { createBooking } = require('../controllers/booking.controller'); router.post('/', createBooking); module.exports = router;
