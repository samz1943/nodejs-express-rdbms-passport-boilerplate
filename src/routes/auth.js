const express = require('express');
const authController = require('../controllers/auth')
const authValidator = require('../validators/auth')

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authValidator, authController.register);
router.post('/verify', authController.verify);
router.post('/refresh-token', authController.refreshToken);
  

module.exports = router;
