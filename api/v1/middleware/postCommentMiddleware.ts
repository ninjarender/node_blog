import { PrismaClient } from ".prisma/client";
import { NextFunction, Response } from "express";
import { postRequest } from "./userPostMiddleware";

const prisma = new PrismaClient()

export async function postCommentMiddleware(req: postRequest, res: Response, next: NextFunction) {
  const post = await prisma.post.findUnique({
    where: {
      slug: req.params.slug
    }
  })

  if (!post) return res.status(404).json({ message: 'Post not found' })

  const authorMatch = post.authorId === req.user.id
  if (authorMatch) return res.status(403).json({ message: 'Access denied' })

  req.post = post

  next()
}
