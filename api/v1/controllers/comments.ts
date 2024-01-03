import { PrismaClient } from ".prisma/client";
import { Response } from "express";
import { postRequest } from "../middleware/userPostMiddleware";

const prisma = new PrismaClient()

export async function create(req: postRequest, res: Response) {
  try {
    const { comment } = req.body

    const postComment = await prisma.comment.create({
      data: {
        authorId: req.user.id,
        postId: req.post.id,
        comment: comment
      }
    })

    res.status(201).json({ comment: postComment })
  } catch (err: any) {
    console.log(err)
    res.status(422).json({ message: err.message })
  } 
}
