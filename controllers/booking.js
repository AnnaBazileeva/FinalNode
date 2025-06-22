const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    const { provider, service, date } = req.body;
    const booking = new Booking({ client: req.user.userId, provider, service, date });
    await booking.save();
    res.status(201).json(booking);
};

exports.getBookings = async (req, res) => {
    const bookings = await Booking.find({ client: req.user.id });
    res.json(bookings);
};