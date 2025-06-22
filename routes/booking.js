
const express = require('express');
const router = express.Router();
const { createBooking, getBookings } = require('../controllers/booking');
const auth = require('../middleware/authentication');

router.post('/', auth, createBooking);
router.get('/', auth, getBookings);

module.exports = router;