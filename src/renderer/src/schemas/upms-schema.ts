import { upmsResponseSchema } from '@shared/schemas/upms-schema'
import { z } from 'zod/v4'

export const userInfoSchema = z
  .object({
    Id: z.number(),
    Name: z.string(),
    Token: z.string()
  })
  .transform((data) => ({
    id: data.Id,
    name: data.Name,
    token: data.Token
  }))

export const loginResponseSchema = upmsResponseSchema.extend({
  result: userInfoSchema.nullable()
})

export type UserResponse = z.infer<typeof loginResponseSchema>

export const roleSchema = z.object({
  RoleID: z.number(),
  RoleName: z.string(),
  BeginTime: z.string(),
  EndTime: z.string()
})
const rolesSchema = z.array(roleSchema)

export const roleResponseSchema = upmsResponseSchema.extend({
  result: rolesSchema.nullable()
})

export type RoleResponse = z.infer<typeof roleResponseSchema>
