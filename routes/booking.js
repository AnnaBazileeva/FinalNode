
const express = require('express');
const router = express.Router();
const { createBooking, getBookings } = require('../controllers/booking');
const auth = require('../middleware/authentication');
const authorizeProvider = require('../middleware/authorizeProvider');

router.post('/services', authorizeProvider, createBooking);
router.get('/services', auth, getBookings);

module.exports = router;