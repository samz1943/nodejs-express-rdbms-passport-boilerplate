const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticate = require('../middlewares/auth')
const commentController = require('../controllers/comment')
const commentValidator = require('../validators/comment')

router.post('/', authenticate, commentValidator, commentController.createComment);

module.exports = router;