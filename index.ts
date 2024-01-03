import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import { router as userRouter } from './api/v1/routes/users'
import { router as userPostsRouter } from './api/v1/routes/userPosts'

dotenv.config()
const PORT = process.env.PORT

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', userRouter)
app.use('/api', userPostsRouter)

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
