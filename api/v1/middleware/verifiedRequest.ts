import express from 'express'

export interface verifiedRequest extends express.Request {
  encryptedPassword: string
}
