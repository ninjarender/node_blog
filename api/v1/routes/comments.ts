import { Router } from "express"
import { create } from "../controllers/comments"
import { verifyToken } from "../middleware/authMiddleware"
import { postCommentMiddleware } from '../middleware/postCommentMiddleware'


export const router = new (Router as any)()

router.post('/v1/posts/:slug/comments', [verifyToken, postCommentMiddleware], create)
