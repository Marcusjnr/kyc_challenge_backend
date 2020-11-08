const express = require('express');
const router = express.Router();
const { signUpUser,loginUser, updateLevel, validateEmail, verifyPassport} = require('../controllers/authentication_controller');

router.post('/user/signup', signUpUser);
router.post('/user/login', loginUser);
router.post('/user/level/update', updateLevel);
router.post('/user/email/validate', validateEmail);
router.post('/user/passport/verify', verifyPassport);

module.exports = router;
