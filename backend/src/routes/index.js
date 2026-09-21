const express = require('express');
const healthRoute = require('./health.route');
const contentRoute = require('./content.route');
const bookingRoute = require('./booking.route');
const contactRoute = require('./contact.route');
const adminRoute = require('./admin.route');

const router = express.Router();

router.use('/health', healthRoute);
router.use('/', contentRoute);
router.use('/bookings', bookingRoute);
router.use('/contacts', contactRoute);
router.use('/admin', adminRoute);

module.exports = router;
