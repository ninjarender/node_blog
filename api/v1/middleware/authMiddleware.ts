import jwt from 'jsonwebtoken'
import express, { Response, NextFunction } from 'express'
import { PrismaClient } from '.prisma/client'
const prisma = new PrismaClient()

export interface verifiedRequest extends express.Request {
  user: {
    id: string,
    email: string,
    name: string | null
  }
}

interface JwtPayload extends jwt.JwtPayload {
  encryptedPassword: string
}

export async function verifyToken(req: verifiedRequest, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'Access denied' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    const user = await prisma.user.findUnique({
      where: { encryptedPassword: decoded.encryptedPassword },
      select: {
        id: true,
        email: true,
        name: true
      }
    })
    
    if (!user) return res.status(401).json({ message: 'Access denied' })

    // @ts-ignore
    req.user = user

    next()
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: 'Invalid token' })
  }
}
