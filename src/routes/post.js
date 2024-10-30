const express = require('express');
const router = express.Router();
const commentRouter = require('./comment')
const authenticate = require('../middlewares/auth')
const postMiddleware = require('../middlewares/post')
const postController = require('../controllers/post')
const postValidator = require('../validators/post')

router.post('/', authenticate, postValidator, postController.createPost);
router.get('/',  authenticate, postController.getAllPosts);
router.get('/:postId',  authenticate, postController.getPostById);
router.put('/:postId',  authenticate, postValidator, postMiddleware, postController.updatePost);
router.delete('/:postId',  authenticate, postMiddleware, postController.deletePost);

router.use('/:id/comment', commentRouter)

module.exports = router;