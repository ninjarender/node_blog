import { PrismaClient } from ".prisma/client"
const prisma = new PrismaClient()

export async function searchedPosts(
  authorId: string | undefined,
  sort: string,
  order: string,
  query: string,
  page: number,
  limit: number
) {
  return await prisma.$transaction([
    prisma.post.count(searchQuery(authorId, (query ?? '').toString())),
    prisma.post.findMany({
      ...searchQuery(authorId, (query ?? '').toString()),
      ...pagination(+(limit ?? 2), +(page ?? 1)),
      ...orderBy((sort ?? 'createdAt').toString(), (order ?? 'asc').toString())
    })
  ]).then(([count, posts]) => {
    return { posts: truncatedPosts(posts), count: count }
  })
}

function searchQuery(authorId: string | undefined, query: string) {
  return {
    where: {
      authorId: authorId,
      OR: ['title', 'body'].map(field => {
        return {
          [field]: {
            contains: query
          }
        }
      })
    }
  }
}

function pagination(limit: number, page: number) {
  const offset = (page - 1) * limit

  return { take: limit, skip: offset }
}

function orderBy(sort: string, order: string) {
  sort = ['createdAt', 'title'].includes(sort) ? sort : 'createdAt'
  order = ['asc', 'desc'].includes(order) ? order : 'asc'

  return {
    orderBy: {
      [sort]: order
    }
  }
}

function truncatedPosts(posts: any) {
  return posts.map((post: {body: string}) => {
    const { body, ...rest } = post

    return { ...rest, body: `${body.slice(0, 5)}...` }
  })
}
