const express = require('express');
const router = express.Router();
const authController = require('../app/Controllers/AuthController');

router.post('/login',authController.login);
router.post('/login/google',authController.loginGooogle);
router.post('/register',authController.register);



module.exports = router;