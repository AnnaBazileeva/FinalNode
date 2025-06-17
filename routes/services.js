const express = require('express')
const router = express.Router()

const {getAllServices, getService, updateService, deleteService, createService} = require('../controllers/services')
const authenticateUser = require('../middleware/authentication');

router.route('/').post(createService).get(getAllServices, authenticateUser)
router.route('/:id').get(getService, authenticateUser).delete(deleteService, authenticateUser).patch(updateService, authenticateUser)

module.exports = router