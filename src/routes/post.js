const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth')
const postController = require('../controllers/post')
const postValidator = require('../validators/post')

router.post('/', authenticate, postValidator, postController.createPost);
router.get('/',  authenticate, postController.getAllPosts);
router.get('/:id',  authenticate, postController.getPostById);

module.exports = router;