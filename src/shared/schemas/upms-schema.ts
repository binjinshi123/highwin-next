import { z } from 'zod/v4'

export const upmsResponseSchema = z.object({
  status: z.number(),
  message: z.string().nullable()
})
