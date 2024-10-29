const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const userController = require('../controllers/user');
const userValidator = require('../validators/user')

router.post('/', passport.authenticate('jwt', { session: false }), userValidator, userController.createUser);
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user ID
 *                   username:
 *                     type: string
 *                     description: The user's username
 */
router.get('/',  passport.authenticate('jwt', { session: false }), userController.getAllUsers);
router.get('/:id',  passport.authenticate('jwt', { session: false }), userController.getUserById);
router.put('/:id',  passport.authenticate('jwt', { session: false }), userController.updateUser);

module.exports = router;