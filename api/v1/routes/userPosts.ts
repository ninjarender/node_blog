import { Router } from "express"
export const router = new (Router as any)()

import { create, destroy, index, update } from '../controllers/userPosts'
import { verifyToken } from "../middleware/authMiddleware"
import { userPostMiddleWare } from "../middleware/userPostMiddleware"

router.post('/v1/user/posts', verifyToken, create)
router.get('/v1/user/posts', verifyToken, index)
router.patch('/v1/user/posts/:slug', [verifyToken, userPostMiddleWare], update)
router.delete('/v1/user/posts/:slug', [verifyToken, userPostMiddleWare], destroy)
