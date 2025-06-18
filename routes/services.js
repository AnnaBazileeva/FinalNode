const express = require('express')
const router = express.Router()

const {getAllServices, getService, updateService, deleteService, createService} = require('../controllers/services')
const authenticateUser = require('../middleware/authentication');
const authorizeProvider = require('../middleware/authorizeProvider');

router.route('/').post(authorizeProvider,createService).get(authenticateUser,getAllServices )
router.route('/:id').get(authenticateUser,getService ).delete(authorizeProvider,deleteService ).patch(authorizeProvider,updateService)


module.exports = router