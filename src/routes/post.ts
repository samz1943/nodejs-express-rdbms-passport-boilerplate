import express from 'express';
import commentRouter from './comment';
import authenticate from '../middlewares/auth';
import postMiddleware from '../middlewares/post';
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from '../controllers/post';
import postValidator from '../validators/post';

const router = express.Router();

router.post('/', authenticate, postValidator, createPost);
router.get('/',  authenticate, getAllPosts);
router.get('/:postId',  authenticate, getPostById);
router.put('/:postId',  authenticate, postValidator, postMiddleware, updatePost);
router.delete('/:postId',  authenticate, postMiddleware, deletePost);

router.use('/:postId/comment', commentRouter)

export default router;