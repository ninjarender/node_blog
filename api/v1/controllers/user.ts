import { PrismaClient } from ".prisma/client"
const prisma = new PrismaClient()

async function create(req: Request, res: Response) {
  try {
    // const { email, name } = req.body
    await prisma.user.create({
      data: {
        email: 'req.body.email',
        name: 'req.body.name'
      }
    })
  } catch (err) {

  }
}

module.exports = {
  create
}
