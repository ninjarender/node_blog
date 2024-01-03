import { PrismaClient } from '.prisma/client'
import { Response, NextFunction } from 'express'
import { verifiedRequest } from './authMiddleware'

const prisma = new PrismaClient()

export interface postRequest extends verifiedRequest {
  post: {
    id: string,
    slug: string,
    title: string,
    body: string,
    createdAt: Date,
    authorId: string
  }
}

export async function userPostMiddleWare(req: postRequest, res: Response, next: NextFunction) {
  const post = await prisma.post.findUnique({
    where: {
      authorId: req.user.id,
      slug: req.params.slug
    }
  })

  if (!post) return res.status(404).json({ message: 'Post not found' })

  req.post = post

  next()
}
