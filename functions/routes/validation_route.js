const express = require('express');
const router = express.Router();
const { validateBVN } = require('../controllers/validation_controller');

router.post('/bvn/validate', validateBVN);

module.exports = router;
