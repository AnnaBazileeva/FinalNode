const Service = require('../models/Service')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllServices = async (req, res) => {
    const services = await Service.find({}).sort('createdAt');
    res.status(StatusCodes.OK).json({ services, count: services.length });
};


const getService = async (req, res) => {
    const { user: { userId }, params: { id: serviceId } } = req;

    const service = await Service.findOne({ _id: serviceId, createdBy: userId });
    if (!service) {
        throw new NotFoundError(`No service with the id ${serviceId}`);
    }
    res.status(StatusCodes.OK).json({ service });
}

const createService = async (req, res) => {
    console.log('➡️ createService called');
    if (!req.user) {
        return res.status(401).json({ msg: 'Authentication invalid' });
    }
    if (req.user.role !== 'provider') {
        return res.status(403).json({ msg: 'Only providers can perform this action' });
    }

    const { company, serviceName, location, description, image } = req.body;

    if (!company || !serviceName || !location) {
        throw new BadRequestError('Please provide all required fields: company, serviceName, location');
    }

    try {
    const service = await Service.create({
        company,
        serviceName,
        location,
        description,
        image,
        createdBy: req.user.userId,
    });
    res.status(StatusCodes.CREATED).json({ service });
}catch (error) {
        throw new BadRequestError('Error adding service');
    }
}

const updateService = async (req, res) => {
    const {
        body: { company, serviceName },
        user: { userId },
        params: { id: serviceId },
    } = req;

    if (company === '' || serviceName === '' || location === '') {
        throw new BadRequestError('Please provide all required fields...');
    }

    const updatedService = await Service.findOneAndUpdate(
        { _id: serviceId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedService) {
        throw new NotFoundError(`No service with the id ${serviceId}`);
    }

    res.status(StatusCodes.OK).json({ service: updatedService });
}

const deleteService = async (req, res) => {
    const {
        user: { userId },
        params: { id: serviceId },
    } = req;

    const service = await Service.findOneAndDelete({ _id: serviceId, createdBy: userId });
    if (!service) {
        throw new NotFoundError(`No service with the id ${serviceId}`);
    }

    res.status(StatusCodes.OK).json({ msg: 'Service deleted successfully' });
}


const getMyServices = async (req, res) => {
    try {
        const userId = req.user.userId;
        const services = await Service.find({ createdBy: userId });
        res.status(StatusCodes.OK).json({ services, count: services.length });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error' });
    }
};



module.exports = {
    getAllServices,
    getService,
    createService,
    updateService,
    deleteService,
    getMyServices
}
