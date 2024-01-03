import { Router } from "express"
import { index, show } from "../controllers/posts"

export const router = new (Router as any)()

router.get('/v1/posts', index)
router.get('/v1/posts/:slug', show)
