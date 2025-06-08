const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    status: { type: String, default: 'confirmed' }
});

module.exports = mongoose.model('Booking', bookingSchema);
