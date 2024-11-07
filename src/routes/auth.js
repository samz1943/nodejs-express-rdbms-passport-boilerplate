const express = require('express');
const authController = require('../controllers/auth')
const authValidator = require('../validators/auth')

const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Perform login and return access and refresh tokens.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user1@example.com
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token
 *                   example: "dGVzdHJlZnJlc2h0b2tlbg=="
 *       400:
 *         description: Bad request, missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Username and password are required."
 *       401:
 *         description: Unauthorized, invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid username or password."
 */
router.post('/login', authController.login);
router.post('/register', authValidator, authController.register);
router.post('/verify', authController.verify);
router.post('/refresh-token', authController.refreshToken);
  

module.exports = router;
