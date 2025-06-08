const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    dayOfWeek: Number,
    timeSlots: [String]
});

module.exports = mongoose.model('Availability', availabilitySchema);
