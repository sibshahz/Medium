import {z} from 'zod';


export const signupInput = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export type SignupInput = z.infer<typeof signupInput>;

// signinInput / SigninInput

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type SigninInput = z.infer<typeof signinInput>;

// createPostInput / CreatePostInput

export const createPostInput = z.object({
  title: z.string(),
  content: z.string()
});

export type CreatePostInput = z.infer<typeof createPostInput>;

// updatePostInput / UpdatePostInput

export const updatePostInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
});

export type UpdatePostInput = z.infer<typeof updatePostInput>;
