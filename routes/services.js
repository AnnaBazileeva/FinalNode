const express = require('express')
const router = express.Router()

const {getAllServices, getService, updateService, deleteService, createService} = require('../controllers/services')
const auth = require('../middleware/authentication');
const authorizeProvider = require('../middleware/authorizeProvider');

router.route('/services').post(authorizeProvider,createService).get(auth,getAllServices )
router.route('/services/:id').get(auth,getService ).delete(authorizeProvider,deleteService ).patch(authorizeProvider,updateService)


module.exports = router