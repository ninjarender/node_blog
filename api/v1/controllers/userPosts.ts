import { PrismaClient } from ".prisma/client"
import { Response } from "express"
import { verifiedRequest } from "../middleware/authMiddleware"
import { postRequest } from "../middleware/userPostMiddleware"
import { searchedPosts } from "../helpers/searchedPosts"

const prisma = new PrismaClient()

export async function create(req: verifiedRequest, res: Response) {
  try {
    const { title, body } = req.body

    const post = await prisma.post.create({
      data: {
        authorId: req.user.id,
        title: title,
        body: body,
        slug: slug(title)
      }
    })

    res.status(201).json({ post: post })
  } catch (err: any) {
    console.log(err)
    res.status(422).json({ message: err.message })
  }
}

function slug(title: string) {
  return `${title.toLowerCase().replace(' ', '-')}-${new Date().getTime()}`
}

export function index(req: verifiedRequest, res: Response) {
  const { sort, order, query, page, limit } = req.query

  searchedPosts(
    req.user.id,
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

export async function update(req: postRequest, res: Response) {
  try {
    const { title, body } = req.body
    const post = await prisma.post.update({
      where: {
        id: req.post.id,
      },
      data: {
        title: title,
        body: body,
        slug: updatedSlug(title)
      }
    })

    res.json({ post: post })
  } catch (err: any) {
    console.log(err)
    res.status(422).json({ message: err.message })
  }
}

function updatedSlug(title: string | undefined) {
  if (title) return `${title.toLowerCase().replace(' ', '-')}-${new Date().getTime()}`
}

export async function destroy(req: postRequest, res: Response) {
  try {
    const post = await prisma.post.delete({
      where: {
        id: req.post.id
      }
    })

    res.json({ post: post })
  } catch (err: any) {
    console.log(err)
    res.status(422).json({ message: err.message })
  }
}
