const express = require('express')
const authenticate = require('../middlewares/auth')
const userController = require('../controllers/user')
const userValidator = require('../validators/user')

const router = express.Router()

router.get('/', authenticate, userController.getAllUsers);
router.get('/:userId', authenticate, userController.getUserById);
router.put('/:userId', authenticate, userValidator, userController.updateUser);

module.exports = router;