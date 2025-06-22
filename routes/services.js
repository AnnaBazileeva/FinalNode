const express = require('express')
const router = express.Router()

const {getAllServices, getService, updateService, deleteService, createService, getMyServices} = require('../controllers/services');

const auth = require('../middleware/authentication');
const authorizeProvider = require('../middleware/authorizeProvider');

router.route('/')
    .get(auth, getAllServices)
    .post(auth, authorizeProvider, createService);

router.get('/myservices', auth, authorizeProvider, getMyServices);

router.route('/:id')
    .get(auth, getService)
    .patch(auth, authorizeProvider, updateService)
    .delete(auth, authorizeProvider, deleteService);

module.exports = router