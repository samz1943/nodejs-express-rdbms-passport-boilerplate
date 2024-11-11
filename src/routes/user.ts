import express from 'express';
import authenticate from '../middlewares/auth';
import * as userController from '../controllers/user';
import userValidator from '../validators/user';

const router = express.Router();

/**
 * @swagger
 * /api/user/self:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The profile of the authenticated user
 *       401:
 *         description: Unauthorized, invalid or missing access token
 */
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

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a single user's information by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The requested user details
 *       401:
 *         description: Unauthorized, invalid or missing access token
 *       404:
 *         description: User not found
 */
router.get('/:userId', authenticate, userController.getUserById);

/**
 * @swagger
 * /api/user/{userId}:
 *   put:
 *     summary: Update a user
 *     description: Update user information by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The updated user information
 *       401:
 *         description: Unauthorized, invalid or missing access token
 *       404:
 *         description: User not found
 */
router.put('/:userId', authenticate, userValidator, userController.updateUser);

/**
 * @swagger
 * /api/user/{userId}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete user information by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Success message
 *       401:
 *         description: Unauthorized, invalid or missing access token
 *       404:
 *         description: User not found
 */
router.delete('/:userId', authenticate, userController.deleteUser);

export default router;
