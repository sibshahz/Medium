import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate())

const app = new Hono().basePath('/api/v1')

app.get('/', (c) => {
  return c.text('Hello Hono!')
})        
// POST /api/v1/user/signin
// POST /api/v1/blog
// PUT /api/v1/blog
// GET /api/v1/blog/:id   
// GET /api/v1/blog/bulk

app.post('/user/signup', (c) => {
  return c.text('User sign up')
})

app.post('/user/signin', (c) => {
  return c.text('User sign in')
})

app.post('/blog', (c) => {
  return c.text('Post blog')
})

app.put('/blog', (c) => {
  return c.text('Update blog post')
})

app.get('/blog', (c) => {
  return c.text('Get all blog posts')
})
app.get('/blog/:id', (c) => {
  return c.text('Get single blog with id')
})



export default app
