import express from 'express';
import authenticate from '../middlewares/auth';
import commentMiddleware from '../middlewares/comment';
import { createComment, getPostComments, getCommentById, updateComment, deleteComment } from '../controllers/comment';
import commentValidator from '../validators/comment';

const router = express.Router({ mergeParams: true });

router.post('/', authenticate, commentValidator, createComment);
router.get('/',  authenticate, getPostComments);
router.get('/:commentId',  authenticate, getCommentById);
router.put('/:commentId',  authenticate, commentValidator, commentMiddleware, updateComment);
router.delete('/:commentId',  authenticate, commentMiddleware, deleteComment);

export default router;