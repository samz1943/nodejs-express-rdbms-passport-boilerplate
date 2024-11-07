const express = require('express')
const authenticate = require('../middlewares/auth')
const userController = require('../controllers/user')
const userValidator = require('../validators/user')

const router = express.Router()

router.get('/self', authenticate, userController.getSelf);
/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a paginated and filtered list of users.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filter users by username
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: johndoe
 *                       email:
 *                         type: string
 *                         example: johndoe@example.com
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-10-01T00:00:00Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2023-10-15T00:00:00Z
 *       401:
 *         description: Unauthorized, invalid or missing access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized access - invalid token."
 */
router.get('/', authenticate, userController.getAllUsers);
router.get('/:userId', authenticate, userController.getUserById);
router.put('/:userId', authenticate, userValidator, userController.updateUser);
router.delete('/:userId', authenticate, userController.deleteUser);

module.exports = router;