import { Router } from "express"
// @ts-ignore
export const router = new Router()

import { create } from '../controllers/users'

router.post('/v1/users', create)
