import { Hono } from "hono"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from "hono/jwt";
import {UpdatePostInput, createPostInput,updatePostInput} from "@sibshahz/medium-blog-zod"

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET : string;
  },
  Variables: {
    userId: string;
  }
}>();

blogRouter.use('/*', async (c, next) => {
  const jwt = c.req.header('Authorization');
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(' ')[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
      c.status(401);
      return c.json({ error: "unauthorized" });
    }
    c.set('userId', payload.id);
    await next()    
  } catch (error) {
    return c.json({error: "error while verifying token"});
  }

})  

// title     String
// content   String
// published Boolean  @default(false)
// authorId  String
blogRouter.post('/',async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
  const body = await c.req.json()
  const { success } = createPostInput.safeParse({...body});
  if(!success){
    return c.json({error: "invalid post input"});
  }
  try {
    const res = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: c.get('userId'),
      }
    })
    c.status(200);
    return c.json(res);
  } catch (error) {
    c.status(403);
    return c.json({ error: "error while posting blog" });
  }

})

blogRouter.put('/', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
  const body = await c.req.json()
  const {success} = updatePostInput.safeParse({...body});
  
  if(!success){
    return c.json({error: "invalid update input"});
  }

  try {
    const res = await prisma.post.update({
      where: {
        id: body.id
      },
      data: {
        title: body.title,
        content: body.content,
      }
    })
    c.status(200);
    return c.json(res)    
  } catch (error) {
    c.status(403);
    return c.json({ error: "error while updating blog" });
  }
})

blogRouter.get('/bulk',async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
  try {
    const res = await prisma.post.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: {
            select: {
                name: true
            }
        }
    }
    });
    return c.json(res);
  } catch (error) {
    return c.json({error: "error while fetching blogs"})    
  }
})
blogRouter.get('/:id',async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
  const id = c.req.param('id');
  try {
    const res = await prisma.post.findUnique({
      where: {
        id: id
      }
    })
    return c.json(res);  
  } catch (error) {
    return c.json({error: "error while fetching blog"})
  }
})