const express = require('express');
const router = express.Router({ mergeParams: true });
const authenticate = require('../middlewares/auth')
const commentMiddleware = require('../middlewares/comment')
const commentController = require('../controllers/comment')
const commentValidator = require('../validators/comment')

router.post('/', authenticate, commentValidator, commentController.createComment);
router.get('/',  authenticate, commentController.getPostComments);
router.get('/:commentId',  authenticate, commentController.getCommentById);
router.put('/:commentId',  authenticate, commentValidator, commentMiddleware, commentController.updateComment);
router.delete('/:commentId',  authenticate, commentMiddleware, commentController.deleteComment);

module.exports = router;