const express = require('express')
const router = express.Router()

const {getAllServices, getService, updateService, deleteService, createService} = require('../controllers/services')

router.route('/').post(createService).get(getAllServices)
router.route('/:id').get(getService).delete(deleteService).patch(updateService)

module.exports = router