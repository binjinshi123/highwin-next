import { z } from 'zod/v4'

export const ItpSecuritySchema = z.object({
  securityid: z.number(),
  symbol: z.string(),
  shortname: z.string(),
  market: z.string(),
  securitytype: z.number()
})

export const SearchResultSchema = z.object({
  data: z.array(ItpSecuritySchema)
})

export type ItpSecurity = z.infer<typeof ItpSecuritySchema>
