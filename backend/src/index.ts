import { Hono } from 'hono'

import { decode, sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user.router'
import { blogRouter } from './routes/blog.router'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string,
    ENCRYPT_KEY: string,
  }
}>().basePath('/api/v1')

app.route("/user", userRouter);
app.route("/blog", blogRouter);





export default app
