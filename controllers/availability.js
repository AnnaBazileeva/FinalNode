const Availability = require('../models/Availability');

exports.setAvailability = async (req, res) => {
    const { date, times } = req.body;
    const provider = req.user.id;

    const existing = await Availability.findOne({ provider, date });

    if (existing) {
        existing.times = times;
        await existing.save();
        return res.json(existing);
    }

    const availability = new Availability({ provider, date, times });
    await availability.save();
    res.status(201).json(availability);
};

exports.getAvailability = async (req, res) => {
    const { providerId, date } = req.query;
    const availability = await Availability.findOne({ provider: providerId, date });
    res.json(availability || { times: [] });
};
