import { PrismaClient } from ".prisma/client"
const prisma = new PrismaClient()

// @ts-ignore
import { Parameters } from 'strong-params'

export async function create(req: Request, res: Response) {
  try {
    const user = await prisma.user.create({
      data: Parameters(req.body).permit('email', 'name').value()
    })

    // @ts-ignore
    res.json(user)
  } catch (err) {
    console.error(err)

    // @ts-ignore
    res.sendStatus(400)
  } finally {
    await prisma.$disconnect()
  }
}
