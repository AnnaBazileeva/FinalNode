const express = require('express');
const router = express.Router();
const { setAvailability, getAvailability } = require('../controllers/availability');
const auth = require('../middleware/authentication');

router.post('/', auth, setAvailability);
router.get('/', getAvailability);

module.exports = router;