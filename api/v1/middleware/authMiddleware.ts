import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import { verifiedRequest } from "./verifiedRequest"

interface JwtPayload extends jwt.JwtPayload {
  encryptedPassword: string
}

export function verifyToken(req: verifiedRequest, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ message: 'Access denied' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    req.encryptedPassword = decoded.encryptedPassword
    next()
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: 'Invalid token' })
  }
}
