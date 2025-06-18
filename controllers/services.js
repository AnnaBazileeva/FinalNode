const Service = require('../models/Service')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllServices = async (req, res) => {
    if (!req.user || !req.user.userId) {
        throw new BadRequestError('User not authenticated');
    }
    const services = await Service.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ services, count: services.length });
}

const getService = async (req, res) => {
    const { user: { userId }, params: { id: serviceId } } = req;

    const service = await Service.findOne({ _id: serviceId, createdBy: userId });
    if (!service) {
        throw new NotFoundError(`No service with the id ${serviceId}`);
    }
    res.status(StatusCodes.OK).json({ service });
}

const createService = async (req, res) => {
    const { company, serviceName, location, description, image } = req.body;

    if (!company || !serviceName || !location) {
        throw new BadRequestError('Please provide all required fields: company, serviceName, location');
    }

    const service = await Service.create({
        company,
        serviceName,
        location,
        description,
        image,
        createdBy: req.user.userId,
    });
    res.status(StatusCodes.CREATED).json({ service });
}

const updateService = async (req, res) => {
    const {
        body: { company, serviceName },
        user: { userId },
        params: { id: serviceId },
    } = req;

    if (company === '' || serviceName === '') {
        throw new BadRequestError("Company and service name can't be empty");
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

module.exports = {
    getAllServices,
    getService,
    createService,
    updateService,
    deleteService
}
