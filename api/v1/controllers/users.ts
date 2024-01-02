import { PrismaClient } from ".prisma/client"
const prisma = new PrismaClient({ errorFormat: 'pretty' })

import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { verifiedRequest } from "../middleware/verifiedRequest"

export async function create(req: Request, res: Response) {
  const { email, password, passwordConfirmation, name } = req.body

  if (password !== passwordConfirmation) return res.status(422).json({ message: 'Password doesn\'t match' })

  const encryptedPassword = await bcrypt.hash(password, 8)
  jwt.sign({ encryptedPassword: encryptedPassword }, process.env.JWT_SECRET as string, { expiresIn: '1d' }, async (err, token) => {
    if (token) {
      try {
        await prisma.user.create({
          data: {
            email: email,
            encryptedPassword: encryptedPassword,
            name: name
          }
        })

        res.status(201).json({ token: token })
      } catch (err) {
        console.log(err)
        // @ts-ignore
        res.status(422).json({ message: err.message })
      } finally {
        await prisma.$disconnect()
      }
    } else if (err) {
      res.status(500).json({ message: 'Something went wrong' })
    }
  })
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (!user) return res.status(401).json({ message: 'Authentication failed' })

    const passwordMatch = await bcrypt.compare(password, user.encryptedPassword)
    if (!passwordMatch) return res.status(401).json({ error: 'Authentication failed' })

    jwt.sign({ encryptedPassword: user.encryptedPassword }, process.env.JWT_SECRET as string, { expiresIn: '1d' }, (err, token) => {
      if (token) {
        res.status(200).json({ token: token })
      } else if (err) {
        res.status(500).json({ message: 'Login failed' })
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Login failed' })
  }
}

export async function show(req: verifiedRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { encryptedPassword: req.encryptedPassword } })
  // @ts-ignore
  const { encryptedPassword, ...rest } = user
  res.json({ user: rest })
}
