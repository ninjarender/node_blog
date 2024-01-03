import { PrismaClient } from ".prisma/client";
import { Request, Response } from 'express'
import { searchedPosts } from "../helpers/searchedPosts";

const prisma = new PrismaClient()

export function index(req: Request, res: Response) {
  const { sort, order, query, page, limit } = req.query

  searchedPosts(
    undefined,
    (sort ?? 'createdAt').toString(),
    (order ?? 'asc').toString(),
    (query ?? '').toString(),
    +(page ?? 1),
    +(limit ?? 2)
  ).then(({ posts, count }) => {
    res.json({ posts: posts, count: count })
  }).catch(err => {
    console.log(err)
    res.status(500).json({ message: 'Internal server error' })
  })
}

export async function show(req: Request, res: Response) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: req.params.slug
      },
      include: {
        comments: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        }
      }
    })

    if (!post) return res.status(404).json({ message: 'Post not found' })

    res.json({ post: post })
  } catch (err: any) {
    console.log(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}
