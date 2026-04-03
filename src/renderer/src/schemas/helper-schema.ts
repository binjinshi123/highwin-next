import z from 'zod/v4'

export const NoticeSchema = z
  .object({
    messageId: z.number(),
    content: z.string(),
    importantLevel: z.string()
  })
  .transform((data) => ({
    id: data.messageId,
    content: data.content,
    level: data.importantLevel
  }))

export type Notice = z.infer<typeof NoticeSchema>

export const NoticeResultSchema = z.array(NoticeSchema)
