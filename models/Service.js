const mongoose = require('mongoose')

const ServiceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, "Please provide your service"],
        maxlength: 30
    },
    company: {
        type: String,
        required: [true, "Please provide name of your company"],
        maxlength: 30
    },
    location: {
        type: String,
        maxlength: 100,
        default: '',
    },
    description: {
        type: String,
        maxlength: 500,
        default: '',
    },
    image: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, 'Please provide user']
    },
    duration: Number,

}, {timestamps: true})

module.exports = mongoose.model('Service', ServiceSchema)