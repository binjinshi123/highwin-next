import { z } from 'zod/v4'

export const TradeMinutesSchema = z.object({
  isok: z.boolean(),
  msg: z.string(),
  data: z.array(z.string())
})

export const IndustrySchema = z.object({
  isOK: z.boolean(),
  msg: z.string(),
  data: z.array(
    z.object({
      plateID: z.number(),
      plateName: z.string()
    })
  )
})
