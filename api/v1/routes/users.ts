import { Router } from "express"
export const router = new(Router as any)()

import { create, login, show } from '../controllers/users'
import { verifyToken } from "../middleware/authMiddleware"

router.post('/v1/registration', create)
router.post('/v1/login', login)
router.get('/v1/users', verifyToken, show)
